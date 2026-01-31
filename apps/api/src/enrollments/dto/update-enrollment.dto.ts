import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator'

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({ description: 'Status', enum: ['ACTIVE', 'LEFT', 'FINISHED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'LEFT', 'FINISHED'])
  status?: string

  @ApiPropertyOptional({ description: 'End date (ISO)' })
  @IsOptional()
  @IsDateString()
  endDate?: string
}
