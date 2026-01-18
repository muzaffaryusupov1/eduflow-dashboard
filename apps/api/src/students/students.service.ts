import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateStudentDto } from './dto/create.student.dto'
import { GetStudentsDto } from './dto/get.students.dto'
import { UpdateStudentDto } from './dto/update.student.dto'

@Injectable()
export class StudentsService{
  constructor(private readonly prisma: PrismaService) {}

  async getStudents(query: GetStudentsDto){
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 10
    const search = query.search?.trim()
    const skip = (page - 1) * pageSize

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } }
          ]
        }
      : undefined

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.student.count({ where })
    ])

    return {
      data,
      meta: { page, pageSize, total }
    }
  }

  async createStudent(dto: CreateStudentDto){
    const student = await this.prisma.student.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        isActive: dto.isActive ?? true,
        phone: dto.phone ?? ''
      }
    })

    return student
  }

  async updateStudent(id: string, dto: UpdateStudentDto){
    const existing = await this.prisma.student.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Student not found')
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        isActive: dto.isActive
      }
    })
  }
  async getStudent(id: string){
    const student = await this.prisma.student.findUnique({ where: { id } })
    if (!student) {
      throw new NotFoundException('Student not found')
    }
    return student
  }

  async deleteStudent(id: string){
    const existing = await this.prisma.student.findUnique({ where: { id } })
    if(!existing){
      throw new NotFoundException('Student not found')
    }

    await this.prisma.student.delete({ where: { id } })
    return { message: 'Student deleted successfully' }
  }
}
