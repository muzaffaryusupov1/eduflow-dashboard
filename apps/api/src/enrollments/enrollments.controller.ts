import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../auth/roles.enum'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import { GetEnrollmentsDto } from './dto/get-enrollments.dto'
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto'
import { EnrollmentsService } from './enrollments.service'

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('groups/:id/enrollments')
  @Roles(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  listByGroup(@Param('id') id: string, @Query() query: GetEnrollmentsDto, @Req() req: any) {
    const user = req.user as { sub: string; role: Role } | undefined
    return this.enrollmentsService.listByGroup(id, query, user ? { id: user.sub, role: user.role } : undefined)
  }

  @Post('groups/:id/enrollments')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  createForGroup(@Param('id') id: string, @Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.createForGroup(id, dto)
  }

  @Patch('enrollments/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto) {
    return this.enrollmentsService.update(id, dto)
  }
}
