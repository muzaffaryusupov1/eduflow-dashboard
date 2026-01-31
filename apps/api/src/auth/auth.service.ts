import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from './roles.enum'

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

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
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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
