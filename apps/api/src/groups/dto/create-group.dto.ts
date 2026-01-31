import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateGroupDto {
  @ApiPropertyOptional({ description: 'Custom title' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ description: 'Course id' })
  @IsString()
  courseId!: string

  @ApiProperty({ description: 'Teacher user id' })
  @IsString()
  teacherId!: string

  @ApiProperty({ description: 'Schedule text', example: 'Mon/Wed/Fri 19:00' })
  @IsString()
  @MinLength(3)
  scheduleText!: string

  @ApiProperty({ description: 'Start date (ISO)' })
  @IsDateString()
  startDate!: string

  @ApiPropertyOptional({ description: 'End date (ISO)' })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: 'Status', enum: ['ACTIVE', 'PAUSED', 'FINISHED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'PAUSED', 'FINISHED'])
  status?: string
}
