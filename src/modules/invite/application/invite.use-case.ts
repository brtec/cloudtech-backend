import { Injectable } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from '../presentation/dto/create-invite.dto';

@Injectable()
export class InviteUseCase {
  constructor(private readonly inviteService: InviteService) {}

  async createInvite(companyId: string, createInviteDto: CreateInviteDto) {
    return this.inviteService.create(companyId, createInviteDto.email, createInviteDto.role);
  }
}
