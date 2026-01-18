import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateStudentDto{
  @ApiProperty({description: 'First name of the student'})
  @IsNotEmpty()
  @IsString()
  firstName!: string

  @ApiProperty({description: 'Last name of the student'})
  @IsNotEmpty()
  @IsString()
  lastName!: string

  @ApiProperty({description: 'Email of the student'})
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @ApiProperty({description: 'Phone number of the student', required: false})
  @IsOptional()
  @IsString()
  phone!: string

  @ApiProperty({description: 'Is the student active?', default: true, required: false})
  @IsOptional()
  @IsBoolean()
  isActive!: boolean
}
