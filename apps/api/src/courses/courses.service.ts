import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { GetCoursesDto } from './dto/get-courses.dto'
import { UpdateCourseDto } from './dto/update-course.dto'

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: GetCoursesDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit
    const search = query.search?.trim()

    const where = {
      ...(search
        ? { title: { contains: search.toLowerCase() } }
        : {}),
      ...(query.status ? { status: query.status } : {}),
    }

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ])

    return {
      data,
      meta: { page, limit, total },
    }
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        monthlyPrice: dto.monthlyPrice,
        status: dto.status ?? 'ACTIVE',
      },
    })
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } })
    if (!course) throw new NotFoundException('Course not found')
    return course
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.ensureExists(id)
    return this.prisma.course.update({
      where: { id },
      data: dto,
    })
  }

  async updateStatus(id: string, status: string) {
    await this.ensureExists(id)
    return this.prisma.course.update({
      where: { id },
      data: { status },
    })
  }

  private async ensureExists(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } })
    if (!course) throw new NotFoundException('Course not found')
  }
}
