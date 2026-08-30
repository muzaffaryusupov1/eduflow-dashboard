import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { StudentsModule } from './students/students.module'
import { CoursesModule } from './courses/courses.module'
import { StaffModule } from './staff/staff.module'
import { GroupsModule } from './groups/groups.module'
import { EnrollmentsModule } from './enrollments/enrollments.module'
import { AttendanceModule } from './attendance/attendance.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StudentsModule,
    CoursesModule,
    StaffModule,
    GroupsModule,
    EnrollmentsModule,
    AttendanceModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
