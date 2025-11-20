import { Injectable } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { AddMemberDto } from '../presentation/dto/add-member.dto';
import { Role } from '@prisma/client';

@Injectable()
export class MembershipUseCase {
  constructor(private readonly membershipService: MembershipService) {}

  async addMember(companyId: string, addMemberDto: AddMemberDto, actorId: string) {
    return this.membershipService.addMember(
      companyId,
      addMemberDto.email,
      addMemberDto.role,
      actorId,
    );
  }

  async updateMemberRole(companyId: string, memberId: string, role: Role) {
    return this.membershipService.updateMemberRole(companyId, memberId, role);
  }

  async removeMember(companyId: string, memberId: string, actorId: string) {
    return this.membershipService.removeMember(companyId, memberId, actorId);
  }
}
