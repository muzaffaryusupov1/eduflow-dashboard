import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const today = new Date().toISOString().slice(0, 10)

    const [activeStudents, activeGroups, activeCourses, todaySessions] = await Promise.all([
      this.prisma.student.count({ where: { isActive: true } }),
      this.prisma.group.count({ where: { status: 'ACTIVE' } }),
      this.prisma.course.count({ where: { status: 'ACTIVE' } }),
      this.prisma.attendanceSession.count({ where: { date: today } }),
    ])

    return {
      activeStudents,
      activeGroups,
      activeCourses,
      todaySessions,
    }
  }

  async getRecentAttendance() {
    const sessions = await this.prisma.attendanceSession.findMany({
      take: 5,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        group: {
          include: {
            course: { select: { id: true, title: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    })

    const sessionIds = sessions.map((session) => session.id)
    const grouped =
      sessionIds.length === 0
        ? []
        : await this.prisma.attendanceRecord.groupBy({
            by: ['sessionId', 'status'],
            where: { sessionId: { in: sessionIds } },
            _count: { _all: true },
          })

    const countsMap = new Map<string, { PRESENT: number; ABSENT: number; LATE: number }>()
    for (const row of grouped) {
      if (!countsMap.has(row.sessionId)) {
        countsMap.set(row.sessionId, { PRESENT: 0, ABSENT: 0, LATE: 0 })
      }
      const current = countsMap.get(row.sessionId)!
      if (row.status === 'PRESENT' || row.status === 'ABSENT' || row.status === 'LATE') {
        current[row.status] = row._count._all
      }
    }

    return sessions.map((session) => {
      const counts = countsMap.get(session.id) ?? { PRESENT: 0, ABSENT: 0, LATE: 0 }
      return {
        id: session.id,
        date: session.date,
        groupId: session.groupId,
        groupTitle: session.group.title,
        courseTitle: session.group.course.title,
        teacherName: session.group.teacher.fullName ?? session.group.teacher.email,
        presentCount: counts.PRESENT,
        absentCount: counts.ABSENT,
        lateCount: counts.LATE,
      }
    })
  }

  async getActiveGroups() {
    const groups = await this.prisma.group.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, fullName: true, email: true } },
        _count: { select: { enrollments: { where: { status: 'ACTIVE' } } } },
      },
    })

    return groups.map((group) => ({
      id: group.id,
      title: group.title,
      scheduleText: group.scheduleText,
      courseTitle: group.course.title,
      teacherName: group.teacher.fullName ?? group.teacher.email,
      studentsCount: group._count.enrollments,
    }))
  }
}
