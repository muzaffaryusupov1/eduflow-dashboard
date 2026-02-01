import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Role } from '../auth/roles.enum'
import { PrismaService } from '../prisma/prisma.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { GetGroupsDto } from './dto/get-groups.dto'
import { UpdateGroupDto } from './dto/update-group.dto'

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}


  async list(query: GetGroupsDto, requester?: { id: string; role: Role }) {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 10
    const skip = (page - 1) * pageSize
    const search = query.query?.trim()

    const where: Record<string, unknown> = {
      ...(query.courseId ? { courseId: query.courseId } : {}),
      ...(query.teacherId ? { teacherId: query.teacherId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { scheduleText: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    if (requester?.role === Role.TEACHER) {
      where.teacherId = requester.id
    }

    const [items, total] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true } },
          teacher: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.group.count({ where }),
    ])

    const groupIds = items.map((group) => group.id)
    const activeCounts = await this.prisma.enrollment.groupBy({
      by: ['groupId'],
      where: {
        groupId: { in: groupIds },
        status: 'ACTIVE',
      },
      _count: { _all: true },
    })

    const activeCountMap = new Map(
      activeCounts.map((row) => [row.groupId, row._count._all])
    )

    const itemsWithCounts = items.map((group) => ({
      ...group,
      studentsCount: activeCountMap.get(group.id) ?? 0,
    }))

    return { items: itemsWithCounts, total, page, pageSize }
  }

  async create(dto: CreateGroupDto) {
    await this.ensureTeacher(dto.teacherId)
    this.ensureDates(dto.startDate, dto.endDate)

    return this.prisma.group.create({
      data: {
        title: dto.title,
        courseId: dto.courseId,
        teacherId: dto.teacherId,
        scheduleText: dto.scheduleText,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: dto.status ?? 'ACTIVE',
      },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, fullName: true, email: true } },
      },
    })
  }

  async findOne(id: string, requester?: { id: string; role: Role }) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, fullName: true, email: true } },
      },
    })

    if (!group) {
      throw new NotFoundException('Group not found')
    }

    if (requester?.role === Role.TEACHER && group.teacherId !== requester.id) {
      throw new NotFoundException('Group not found')
    }

    const studentsCount = await this.prisma.enrollment.count({
      where: { groupId: id, status: 'ACTIVE' },
    })

    return { ...group, studentsCount }
  }

  async update(id: string, dto: UpdateGroupDto) {
    const existing = await this.prisma.group.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Group not found')
    }

    if (dto.teacherId) {
      await this.ensureTeacher(dto.teacherId)
    }

    this.ensureDates(dto.startDate ?? existing.startDate.toISOString(), dto.endDate)

    const updated = await this.prisma.group.update({
      where: { id },
      data: {
        title: dto.title,
        courseId: dto.courseId,
        teacherId: dto.teacherId,
        scheduleText: dto.scheduleText,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
      },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, fullName: true, email: true } },
      },
    })

    const studentsCount = await this.prisma.enrollment.count({
      where: { groupId: id, status: 'ACTIVE' },
    })

    return { ...updated, studentsCount }
  }

  async updateStatus(id: string, status: string) {
    const existing = await this.prisma.group.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Group not found')
    }

    const updated = await this.prisma.group.update({
      where: { id },
      data: { status },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, fullName: true, email: true } },
      },
    })

    const studentsCount = await this.prisma.enrollment.count({
      where: { groupId: id, status: 'ACTIVE' },
    })

    return { ...updated, studentsCount }
  }

  private async ensureTeacher(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { id: true, role: true },
    })
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new BadRequestException('Teacher must be a user with TEACHER role')
    }
  }

  private ensureDates(startDate: string, endDate?: string) {
    if (!endDate) return
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) {
      throw new BadRequestException('endDate must be greater than or equal to startDate')
    }
  }
}
