import { PartialType } from '@nestjs/swagger'
import { CreateGroupDto } from './create-group.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsOptional()
  @IsString()
  override title?: string
}
