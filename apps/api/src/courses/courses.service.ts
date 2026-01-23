import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { GetCoursesDto } from './dto/get-courses.dto'

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: GetCoursesDto) {
    const courseRepo = (this.prisma as any).course
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit
    const search = query.search?.trim()

    const where = {
      ...(search
        ? { title: { contains: search, mode: 'insensitive' } }
        : {}),
      ...(query.status ? { status: query.status } : {}),
    }

    const [data, total] = await Promise.all([
      courseRepo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      courseRepo.count({ where }),
    ])

    return {
      data,
      meta: { page, limit, total },
    }
  }

  async create(dto: CreateCourseDto) {
    const courseRepo = (this.prisma as any).course
    return courseRepo.create({
      data: {
        title: dto.title,
        monthlyPrice: dto.monthlyPrice,
        status: dto.status ?? 'ACTIVE',
      },
    })
  }

  async findOne(id: string) {
    const courseRepo = (this.prisma as any).course
    const course = await courseRepo.findUnique({ where: { id } })
    if (!course) throw new NotFoundException('Course not found')
    return course
  }

  async update(id: string, dto: UpdateCourseDto) {
    const courseRepo = (this.prisma as any).course
    await this.ensureExists(id)
    return courseRepo.update({
      where: { id },
      data: dto,
    })
  }

  async updateStatus(id: string, status: string) {
    const courseRepo = (this.prisma as any).course
    await this.ensureExists(id)
    return courseRepo.update({
      where: { id },
      data: { status },
    })
  }

  private async ensureExists(id: string) {
    const courseRepo = (this.prisma as any).course
    const course = await courseRepo.findUnique({ where: { id } })
    if (!course) throw new NotFoundException('Course not found')
  }
}
