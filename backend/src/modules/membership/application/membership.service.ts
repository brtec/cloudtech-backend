import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { MembershipRepository } from '../infrastructure/repositories/membership.repository';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';
import { Role } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addMember(companyId: string, email: string, role: Role) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMembership = await this.membershipRepository.findByUserAndCompany(user.id, companyId);
    if (existingMembership) {
      throw new ConflictException('User is already a member of this company');
    }

    return this.membershipRepository.create({
      user: { connect: { id: user.id } },
      company: { connect: { id: companyId } },
      role,
    });
  }

  async updateMemberRole(companyId: string, memberId: string, role: Role) {
    return this.membershipRepository.update(memberId, { role });
  }

  async removeMember(companyId: string, memberId: string) {
    return this.membershipRepository.remove(memberId);
  }
}
