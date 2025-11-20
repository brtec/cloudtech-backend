import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateMemberDto {
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
