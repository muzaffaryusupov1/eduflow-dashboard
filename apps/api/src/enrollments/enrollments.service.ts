import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Role } from '../auth/roles.enum'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import { GetEnrollmentsDto } from './dto/get-enrollments.dto'
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto'

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByGroup(groupId: string, query: GetEnrollmentsDto, requester?: { id: string; role: Role }) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException('Group not found')

    if (requester?.role === Role.TEACHER && group.teacherId !== requester.id) {
      throw new NotFoundException('Group not found')
    }

    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 10
    const skip = (page - 1) * pageSize

    const where = {
      groupId,
      ...(query.status ? { status: query.status } : {}),
    }

    const [items, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
        },
      }),
      this.prisma.enrollment.count({ where }),
    ])

    return { items, total, page, pageSize }
  }

  async createForGroup(groupId: string, dto: CreateEnrollmentDto) {
    await this.ensureGroup(groupId)
    await this.ensureStudent(dto.studentId)

    const existingActive = await this.prisma.enrollment.findFirst({
      where: {
        groupId,
        studentId: dto.studentId,
        status: 'ACTIVE',
      },
    })

    if (existingActive) {
      throw new BadRequestException('Student already has an active enrollment in this group')
    }

    return this.prisma.enrollment.create({
      data: {
        groupId,
        studentId: dto.studentId,
        startDate: new Date(dto.startDate),
        status: 'ACTIVE',
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    })
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id } })
    if (!enrollment) throw new NotFoundException('Enrollment not found')

    const status = dto.status ?? enrollment.status
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : status !== 'ACTIVE'
        ? new Date()
        : null

    return this.prisma.enrollment.update({
      where: { id },
      data: {
        status,
        endDate,
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    })
  }

  async listByStudent(studentId: string) {
    await this.ensureStudent(studentId)
    return this.prisma.enrollment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        group: {
          include: {
            course: { select: { id: true, title: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    })
  }

  private async ensureStudent(studentId: string) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundException('Student not found')
  }

  private async ensureGroup(groupId: string) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException('Group not found')
  }
}
