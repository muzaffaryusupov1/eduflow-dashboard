import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'owner@eduflow.dev' })
  @IsEmail()
  email!: string;
}
