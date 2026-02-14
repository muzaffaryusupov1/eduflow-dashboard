import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Role } from '../auth/roles.enum'
import { PrismaService } from '../prisma/prisma.service'
import { GetAttendanceHistoryDto } from './dto/get-attendance-history.dto'
import { GetAttendanceSessionDto } from './dto/get-attendance-session.dto'
import { GetMyGroupsDto } from './dto/get-my-groups.dto'
import { SaveAttendanceSessionDto } from './dto/save-attendance-session.dto'

type Requester = { id: string; role: Role }

const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE'] as const

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async listMyGroups(query: GetMyGroupsDto, requester: Requester) {
    const date = normalizeDate(query.date)
    const groups = await this.prisma.group.findMany({
      where: { teacherId: requester.id },
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { id: true, title: true } },
      },
    })

    if (groups.length === 0) {
      return []
    }

    const sessions = await this.prisma.attendanceSession.findMany({
      where: { groupId: { in: groups.map((group) => group.id) }, date },
      select: { id: true, groupId: true },
    })
    const sessionMap = new Map(sessions.map((session) => [session.groupId, session.id]))

    return groups.map((group) => ({
      ...group,
      hasSession: sessionMap.has(group.id),
      sessionId: sessionMap.get(group.id) ?? null,
    }))
  }

  async getSession(query: GetAttendanceSessionDto, requester: Requester) {
    const date = normalizeDate(query.date)
    const group = await this.prisma.group.findUnique({
      where: { id: query.groupId },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, fullName: true, email: true } },
      },
    })

    if (!group) {
      throw new NotFoundException('Group not found')
    }

    if (requester.role === Role.TEACHER && group.teacherId !== requester.id) {
      throw new NotFoundException('Group not found')
    }

    const activeEnrollments = await this.prisma.enrollment.findMany({
      where: { groupId: query.groupId, status: 'ACTIVE' },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const students = activeEnrollments.map((enrollment) => enrollment.student)
    const studentIds = students.map((student) => student.id)

    const session = await this.prisma.attendanceSession.findUnique({
      where: { groupId_date: { groupId: query.groupId, date } },
    })

    const records = session
      ? await this.prisma.attendanceRecord.findMany({
          where: {
            sessionId: session.id,
            studentId: { in: studentIds },
          },
          select: { studentId: true, status: true, note: true },
        })
      : []

    return {
      group,
      date,
      session: session
        ? {
            id: session.id,
            groupId: session.groupId,
            date: session.date,
            takenByUserId: session.takenByUserId,
            records,
          }
        : null,
      students,
    }
  }

  async saveSession(dto: SaveAttendanceSessionDto, requester: Requester) {
    const date = normalizeDate(dto.date)
    const group = await this.prisma.group.findUnique({ where: { id: dto.groupId } })
    if (!group) {
      throw new NotFoundException('Group not found')
    }

    if (requester.role === Role.TEACHER && group.teacherId !== requester.id) {
      throw new NotFoundException('Group not found')
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { groupId: dto.groupId, status: 'ACTIVE' },
      select: { studentId: true },
    })
    const activeStudentIds = new Set(enrollments.map((row) => row.studentId))

    for (const record of dto.records) {
      if (!activeStudentIds.has(record.studentId)) {
        throw new BadRequestException('Student is not actively enrolled in this group')
      }
    }

    const session = await this.prisma.attendanceSession.upsert({
      where: { groupId_date: { groupId: dto.groupId, date } },
      create: {
        groupId: dto.groupId,
        date,
        takenByUserId: requester.id,
      },
      update: {
        takenByUserId: requester.id,
      },
    })

    const writes = dto.records.map((record) =>
      this.prisma.attendanceRecord.upsert({
        where: { sessionId_studentId: { sessionId: session.id, studentId: record.studentId } },
        create: {
          sessionId: session.id,
          studentId: record.studentId,
          status: record.status,
          note: record.note,
        },
        update: {
          status: record.status,
          note: record.note,
        },
      })
    )

    await this.prisma.$transaction(writes)

    const records = await this.prisma.attendanceRecord.findMany({
      where: { sessionId: session.id },
      select: { studentId: true, status: true, note: true },
    })

    return {
      session: {
        id: session.id,
        groupId: session.groupId,
        date: session.date,
        takenByUserId: session.takenByUserId,
        records,
      },
    }
  }

  async listHistory(query: GetAttendanceHistoryDto) {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 10
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {
      ...(query.groupId ? { groupId: query.groupId } : {}),
      ...(query.teacherId ? { group: { teacherId: query.teacherId } } : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            date: {
              ...(query.dateFrom ? { gte: query.dateFrom } : {}),
              ...(query.dateTo ? { lte: query.dateTo } : {}),
            },
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.prisma.attendanceSession.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' },
        include: {
          group: {
            include: {
              course: { select: { id: true, title: true } },
              teacher: { select: { id: true, fullName: true, email: true } },
            },
          },
          takenBy: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.attendanceSession.count({ where }),
    ])

    const sessionIds = items.map((session) => session.id)
    const grouped =
      sessionIds.length === 0
        ? []
        : await this.prisma.attendanceRecord.groupBy({
            by: ['sessionId', 'status'],
            where: { sessionId: { in: sessionIds } },
            _count: { _all: true },
          })

    const countsMap = new Map<
      string,
      { PRESENT: number; ABSENT: number; LATE: number }
    >()
    for (const row of grouped) {
      if (!countsMap.has(row.sessionId)) {
        countsMap.set(row.sessionId, { PRESENT: 0, ABSENT: 0, LATE: 0 })
      }
      const current = countsMap.get(row.sessionId)!
      if (ATTENDANCE_STATUSES.includes(row.status as (typeof ATTENDANCE_STATUSES)[number])) {
        current[row.status as keyof typeof current] = row._count._all
      }
    }

    const itemsWithCounts = items.map((session) => {
      const counts = countsMap.get(session.id) ?? { PRESENT: 0, ABSENT: 0, LATE: 0 }
      return {
        ...session,
        presentCount: counts.PRESENT,
        absentCount: counts.ABSENT,
        lateCount: counts.LATE,
      }
    })

    return { items: itemsWithCounts, total, page, pageSize }
  }

  async getHistoryDetail(id: string) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            course: { select: { id: true, title: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
          },
        },
        takenBy: { select: { id: true, fullName: true, email: true } },
        records: {
          include: {
            student: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session) {
      throw new NotFoundException('Attendance session not found')
    }

    return session
  }
}

function normalizeDate(input?: string) {
  if (!input) return new Date().toISOString().slice(0, 10)
  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) return input
  return parsed.toISOString().slice(0, 10)
}
