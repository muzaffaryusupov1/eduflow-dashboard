import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

const STATUS_VALUES = ['active', 'inactive'] as const
export type StudentStatusFilter = (typeof STATUS_VALUES)[number]

export class GetStudentsDto{
  @ApiPropertyOptional({ description: 'Search by name, email, or phone' })
  @IsOptional()
  @IsString()
  search?: string

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
  limit?: number

  @ApiPropertyOptional({
    description: 'Filter by student status',
    enum: STATUS_VALUES,
    example: 'active'
  })
  @IsOptional()
  @IsIn(STATUS_VALUES)
  status?: StudentStatusFilter
}
