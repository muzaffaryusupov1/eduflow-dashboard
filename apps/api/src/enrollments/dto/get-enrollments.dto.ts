import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator'

export class GetEnrollmentsDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: ['ACTIVE', 'LEFT', 'FINISHED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'LEFT', 'FINISHED'])
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
