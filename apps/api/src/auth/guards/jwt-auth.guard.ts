import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service'
import { IS_PUBLIC_KEY } from '../public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = header.replace('Bearer ', '').trim();
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new UnauthorizedException('JWT access secret not configured');
    }

    try {
      const payload = jwt.verify(token, secret) as {
        sub: string
        email: string
        role: string
        activeSessionId?: string
      }

      if (!payload.activeSessionId) {
        throw new UnauthorizedException('Session revoked');
      }

      const rows = await this.prisma.$queryRaw<{ activeSessionId: string }[]>`
        SELECT "activeSessionId" FROM "GlobalSession" WHERE "id" = 1 LIMIT 1
      `
      const activeSessionId = rows[0]?.activeSessionId

      if (!activeSessionId || activeSessionId !== payload.activeSessionId) {
        throw new UnauthorizedException('Session revoked');
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
