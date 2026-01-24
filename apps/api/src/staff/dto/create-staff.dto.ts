import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateStaffDto {
  @ApiProperty({ description: 'Full name' })
  @IsString()
  @MinLength(2)
  fullName!: string

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email!: string

  @ApiPropertyOptional({ description: 'Phone' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: 'Password (optional, will be generated if missing)' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string
}
