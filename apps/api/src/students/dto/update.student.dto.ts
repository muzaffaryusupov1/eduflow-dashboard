import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateStudentDto{
  @ApiPropertyOptional({description: 'First name of the student'})
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiPropertyOptional({description: 'Last name of the student'})
  @IsOptional()
  @IsString()
  lastName?: string

  @ApiPropertyOptional({description: 'Email of the student'})
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({description: 'Phone number of the student'})
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({description: 'Is the student active?'})
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
