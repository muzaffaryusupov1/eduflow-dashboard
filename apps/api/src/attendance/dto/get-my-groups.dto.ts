import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'

export class GetMyGroupsDto {
  @ApiPropertyOptional({ description: 'Date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  date?: string
}
