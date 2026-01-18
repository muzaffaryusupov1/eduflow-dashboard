import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { StudentsController } from './students.controller'
import { StudentsService } from './students.service'

@Module({
  imports: [PrismaModule],
  controllers: [StudentsController],
  providers: [StudentsService]
})

export class StudentsModule{}
