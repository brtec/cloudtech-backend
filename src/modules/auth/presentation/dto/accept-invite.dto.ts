import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty()
  @IsString()
  token: string;
}
