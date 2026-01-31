import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../auth/roles.enum'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateGroupDto } from './dto/create-group.dto'
import { GetGroupsDto } from './dto/get-groups.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { GroupsService } from './groups.service'

@ApiTags('groups')
@ApiBearerAuth()
@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('groups')
  @Roles(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  list(@Query() query: GetGroupsDto, @Req() req: any) {
    const user = req.user as { sub: string; role: Role } | undefined
    return this.groupsService.list(query, user ? { id: user.sub, role: user.role } : undefined)
  }

  @Post('groups')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto)
  }

  @Get('groups/:id')
  @Roles(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  getOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user as { sub: string; role: Role } | undefined
    return this.groupsService.findOne(id, user ? { id: user.sub, role: user.role } : undefined)
  }

  @Patch('groups/:id')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto)
  }

  @Patch('groups/:id/status')
  @Roles(Role.OWNER, Role.ADMIN)
  @UseGuards(RolesGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.groupsService.updateStatus(id, status)
  }
}
