import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class GetGroupsDto {
  @ApiPropertyOptional({ description: 'Search by title or scheduleText' })
  @IsOptional()
  @IsString()
  query?: string

  @ApiPropertyOptional({ description: 'Filter by course id' })
  @IsOptional()
  @IsString()
  courseId?: string

  @ApiPropertyOptional({ description: 'Filter by teacher id' })
  @IsOptional()
  @IsString()
  teacherId?: string

  @ApiPropertyOptional({ description: 'Filter by status', enum: ['ACTIVE', 'PAUSED', 'FINISHED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'PAUSED', 'FINISHED'])
  status?: string

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number
}
