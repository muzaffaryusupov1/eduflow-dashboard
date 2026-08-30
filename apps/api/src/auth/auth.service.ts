import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { randomBytes, randomUUID } from 'crypto'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from './roles.enum'

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  activeSessionId: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isActive === false) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const activeSessionId = randomUUID()
    await this.setActiveSession(activeSessionId)

    const tokens = this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
      activeSessionId,
    });

    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      throw new UnauthorizedException('JWT refresh secret not configured');
    }

    try {
      const payload = jwt.verify(refreshToken, refreshSecret) as JwtPayload;
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user?.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const activeSessionId = await this.getActiveSession()
      if (!activeSessionId || payload.activeSessionId !== activeSessionId) {
        throw new UnauthorizedException('Session revoked');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.issueTokens({
        sub: user.id,
        email: user.email,
        role: user.role as Role,
        activeSessionId: payload.activeSessionId,
      });

      const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, refreshTokenHash: null },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return success to avoid leaking which emails exist.
    if (!user || user.isActive === false) {
      this.logger.warn(`Password reset requested for unknown or inactive email: ${email}`);
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // MVP delivery: token printed to backend console; owner relays to user.
    this.logger.log(
      `\n  ===== PASSWORD RESET =====\n  Email:   ${user.email}\n  Token:   ${rawToken}\n  Expires: ${expiresAt.toISOString()}\n  ==========================`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const candidates = await this.prisma.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    let match: (typeof candidates)[number] | null = null;
    for (const candidate of candidates) {
      if (await bcrypt.compare(token, candidate.tokenHash)) {
        match = candidate;
        break;
      }
    }

    if (!match) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: match.userId },
        data: { passwordHash, refreshTokenHash: null },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: match.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate every other unused token for this user.
      this.prisma.passwordResetToken.updateMany({
        where: { userId: match.userId, usedAt: null, id: { not: match.id } },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  private issueTokens(payload: JwtPayload): TokenPair {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new UnauthorizedException('JWT secrets not configured');
    }

    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  private async getActiveSession(): Promise<string | null> {
    const rows = await this.prisma.$queryRaw<{ activeSessionId: string }[]>`
      SELECT "activeSessionId" FROM "GlobalSession" WHERE "id" = 1 LIMIT 1
    `
    return rows[0]?.activeSessionId ?? null
  }

  private async setActiveSession(activeSessionId: string) {
    const updated = await this.prisma.$executeRaw`
      UPDATE "GlobalSession"
      SET "activeSessionId" = ${activeSessionId}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = 1
    `
    if (!updated) {
      await this.prisma.$executeRaw`
        INSERT INTO "GlobalSession" ("id", "activeSessionId", "createdAt", "updatedAt")
        VALUES (1, ${activeSessionId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
    }
  }
}
