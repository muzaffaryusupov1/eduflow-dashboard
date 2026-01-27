import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../auth/roles.enum'
import { CoursesService } from './courses.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { GetCoursesDto } from './dto/get-courses.dto'
import { UpdateCourseDto } from './dto/update-course.dto'

@ApiTags('courses')
@Controller()
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('courses')
  list(@Query() query: GetCoursesDto) {
    return this.coursesService.list(query)
  }

  @Get('courses/:id')
  getOne(@Param('id') id: string) {
    return this.coursesService.findOne(id)
  }

  @Post('courses')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto)
  }

  @Patch('courses/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto)
  }

  @Patch('courses/:id/status')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.coursesService.updateStatus(id, status)
  }
}
