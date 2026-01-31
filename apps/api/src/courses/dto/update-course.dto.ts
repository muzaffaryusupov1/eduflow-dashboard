import { PartialType } from '@nestjs/swagger'
import { CreateCourseDto } from './create-course.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsString()
  override status?: string
}
