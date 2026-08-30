import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats()
  }

  @Get('recent-attendance')
  getRecentAttendance() {
    return this.dashboardService.getRecentAttendance()
  }

  @Get('active-groups')
  getActiveGroups() {
    return this.dashboardService.getActiveGroups()
  }
}
