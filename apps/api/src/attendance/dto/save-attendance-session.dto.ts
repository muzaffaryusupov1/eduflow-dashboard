import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDateString, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator'

const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE'] as const

export class AttendanceRecordInput {
  @ApiProperty({ description: 'Student id' })
  @IsString()
  studentId!: string

  @ApiProperty({ description: 'Status', enum: ATTENDANCE_STATUSES })
  @IsIn(ATTENDANCE_STATUSES)
  status!: string

  @ApiProperty({ description: 'Optional note', required: false })
  @IsOptional()
  @IsString()
  note?: string
}

export class SaveAttendanceSessionDto {
  @ApiProperty({ description: 'Group id' })
  @IsString()
  groupId!: string

  @ApiProperty({ description: 'Date (YYYY-MM-DD)' })
  @IsDateString()
  date!: string

  @ApiProperty({ description: 'Attendance records', type: [AttendanceRecordInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordInput)
  records!: AttendanceRecordInput[]
}
