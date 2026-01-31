import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { Role } from '../auth/roles.enum'
import { PrismaService } from '../prisma/prisma.service'
import { CreateStaffDto } from './dto/create-staff.dto'
import { GetStaffDto } from './dto/get-staff.dto'
import { UpdateStaffDto } from './dto/update-staff.dto'

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: GetStaffDto) {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 10
    const skip = (page - 1) * pageSize
    const search = query.query?.trim()

    const where = {
      role: 'TEACHER',
      ...(search
        ? {
            OR: [
              { fullName: { contains: search.toLowerCase() } },
              { email: { contains: search.toLowerCase() } },
            ],
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      data,
      meta: { page, pageSize, total },
    }
  }

  async create(dto: CreateStaffDto) {
    const password = dto.password ?? `Edu${Math.random().toString(36).slice(2, 10)}!`
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone as string,
        role: Role.TEACHER,
        passwordHash,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return { user, temporaryPassword: dto.password ? undefined : password }
  }

  async findOne(id: string, requester: { id: string; role: Role }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user || user.role !== Role.TEACHER) {
      throw new NotFoundException('Staff not found')
    }

    if (requester.role === Role.TEACHER && requester.id !== id) {
      throw new ForbiddenException('Insufficient role')
    }

    return user
  }

  async update(id: string, dto: UpdateStaffDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } })
    if (!existing || existing.role !== Role.TEACHER) {
      throw new NotFoundException('Staff not found')
    }

    const data: Record<string, unknown> = {
      fullName: dto.fullName,
      phone: dto.phone,
    }

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10)
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })
  }

  async updateStatus(id: string, isActive: boolean) {
    const existing = await this.prisma.user.findUnique({ where: { id } })
    if (!existing || existing.role !== Role.TEACHER) {
      throw new NotFoundException('Staff not found')
    }

    return this.prisma.user.update({
      where: { id },
      data: {isActive},
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })
  }

  async resetPassword(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } })
    if (!existing || existing.role !== Role.TEACHER) {
      throw new NotFoundException('Staff not found')
    }

    const newPassword = `Edu${Math.random().toString(36).slice(2, 10)}!`
    const passwordHash = await bcrypt.hash(newPassword, 10)

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    })

    return { id, temporaryPassword: newPassword }
  }
}
