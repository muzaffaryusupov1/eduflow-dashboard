import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../auth/roles.enum'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AttendanceService } from './attendance.service'
import { GetAttendanceHistoryDto } from './dto/get-attendance-history.dto'
import { GetAttendanceSessionDto } from './dto/get-attendance-session.dto'
import { GetMyGroupsDto } from './dto/get-my-groups.dto'
import { SaveAttendanceSessionDto } from './dto/save-attendance-session.dto'

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('my-groups')
  @Roles(Role.TEACHER)
  @UseGuards(RolesGuard)
  listMyGroups(@Query() query: GetMyGroupsDto, @Req() req: any) {
    const user = req.user as { sub: string; role: Role }
    return this.attendanceService.listMyGroups(query, { id: user.sub, role: user.role })
  }

  @Get('session')
  @Roles(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  getSession(@Query() query: GetAttendanceSessionDto, @Req() req: any) {
    const user = req.user as { sub: string; role: Role }
    return this.attendanceService.getSession(query, { id: user.sub, role: user.role })
  }

  @Post('session')
  @Roles(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  saveSession(@Body() dto: SaveAttendanceSessionDto, @Req() req: any) {
    const user = req.user as { sub: string; role: Role }
    return this.attendanceService.saveSession(dto, { id: user.sub, role: user.role })
  }

  @Get('history')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  listHistory(@Query() query: GetAttendanceHistoryDto) {
    return this.attendanceService.listHistory(query)
  }

  @Get('sessions/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  getHistoryDetail(@Param('id') id: string) {
    return this.attendanceService.getHistoryDetail(id)
  }
}
