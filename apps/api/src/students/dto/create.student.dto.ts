import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateStudentDto{
  @ApiProperty({description: 'First name of the student'})
  @IsNotEmpty()
  firstName!: string

  @ApiProperty({description: 'Last name of the student'})
  @IsNotEmpty()
  lastName!: string

  @ApiProperty({description: 'Email of the student'})
  @IsNotEmpty()
  email!: string

  @ApiProperty({description: 'Phone number of the student', required: false})
  @IsOptional()
  phone!: string

  @ApiProperty({description: 'Is the student active?', default: true, required: false})
  @IsOptional()
  isActive!: boolean
}
