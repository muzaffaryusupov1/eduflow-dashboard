import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString } from 'class-validator'

export class GetAttendanceSessionDto {
  @ApiProperty({ description: 'Group id' })
  @IsString()
  groupId!: string

  @ApiProperty({ description: 'Date (YYYY-MM-DD)' })
  @IsDateString()
  date!: string
}
