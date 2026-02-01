import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString } from 'class-validator'

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Student id' })
  @IsString()
  studentId!: string

  @ApiProperty({ description: 'Start date (ISO)' })
  @IsDateString()
  startDate!: string
}
