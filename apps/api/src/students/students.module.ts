import { Module } from '@nestjs/common'
import { EnrollmentsModule } from '../enrollments/enrollments.module'
import { PrismaModule } from '../prisma/prisma.module'
import { StudentsController } from './students.controller'
import { StudentsService } from './students.service'

@Module({
  imports: [PrismaModule, EnrollmentsModule],
  controllers: [StudentsController],
  providers: [StudentsService]
})

export class StudentsModule{}
