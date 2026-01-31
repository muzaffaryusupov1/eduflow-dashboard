import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class CreateCourseDto {
  @ApiProperty({ description: 'Course title' })
  @IsString()
  @MinLength(2)
  title!: string

  @ApiProperty({ description: 'Monthly price' })
  @IsNumber()
  @Min(0)
  monthlyPrice!: number

  @ApiProperty({ description: 'Course status', required: false, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string
}
