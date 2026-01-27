import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
