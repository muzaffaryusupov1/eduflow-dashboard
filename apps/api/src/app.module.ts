import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { StudentsModule } from './students/students.module'
import { CoursesModule } from './courses/courses.module'

@Module({
  imports: [PrismaModule, AuthModule, StudentsModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
