import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { CreateStaffDto } from './create-staff.dto'

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @IsOptional()
  @IsString()
  override fullName?: string

  @IsOptional()
  @IsString()
  override phone?: string

  @IsOptional()
  @IsString()
  override password?: string
}
