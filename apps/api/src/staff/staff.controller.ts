import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../auth/roles.enum'
import { CreateStaffDto } from './dto/create-staff.dto'
import { GetStaffDto } from './dto/get-staff.dto'
import { UpdateStaffDto } from './dto/update-staff.dto'
import { StaffService } from './staff.service'

@ApiTags('staff')
@ApiBearerAuth()
@Controller()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('staff')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  list(@Query() query: GetStaffDto) {
    return this.staffService.list(query)
  }

  @Post('staff')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto)
  }

  @Get('staff/:id')
  @Roles(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  getOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user as { sub: string; role: Role } | undefined
    if (!user) throw new ForbiddenException('Insufficient role')
    return this.staffService.findOne(id, { id: user.sub, role: user.role })
  }

  @Patch('staff/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto)
  }

  @Patch('staff/:id/status')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.staffService.updateStatus(id, Boolean(isActive))
  }

  @Post('staff/:id/reset-password')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  resetPassword(@Param('id') id: string) {
    return this.staffService.resetPassword(id)
  }
}
