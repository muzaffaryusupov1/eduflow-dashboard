import { PrismaService } from '../prisma/prisma.service'
import { CreateStudentDto } from './dto/create.student.dto'

export class StudentsService{
  constructor(private readonly prisma: PrismaService) {}

  async createStudent(dto: CreateStudentDto){
    const student = await this.prisma.student.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        isActive: dto.isActive ?? false,
        phone: dto.phone,
      }
    })

    return student
  }
}
