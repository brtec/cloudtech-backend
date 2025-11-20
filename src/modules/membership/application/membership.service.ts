import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { MembershipRepository } from '../infrastructure/repositories/membership.repository';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';
import { Role } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addMember(companyId: string, email: string, role: Role, actorId: string) {
    // verify actor's membership and permissions
    const actorMembership = await this.membershipRepository.findByUserAndCompany(actorId, companyId);
    if (!actorMembership) {
      throw new ForbiddenException('Actor is not a member of this company');
    }
    if (actorMembership.role !== Role.OWNER && actorMembership.role !== Role.ADMIN) {
      throw new ForbiddenException('Actor does not have permission to add members');
    }

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
    const membership = await this.membershipRepository.findById(memberId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.companyId !== companyId) {
      throw new ConflictException('Membership does not belong to this company');
    }

    if (membership.role === Role.OWNER && role !== Role.OWNER) {
      // Checking if this is the last owner
      const ownersCount = await this.membershipRepository.countByRole(companyId, Role.OWNER);
      if (ownersCount <= 1) {
        throw new ConflictException('Cannot change role of the last OWNER');
      }
    }

    return this.membershipRepository.update(memberId, { role });
  }

  async removeMember(companyId: string, memberId: string, actorId: string) {
    const membership = await this.membershipRepository.findById(memberId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.companyId !== companyId) {
      throw new ConflictException('Membership does not belong to this company');
    }

    // Fetch actor's membership to check permissions
    const actorMembership = await this.membershipRepository.findByUserAndCompany(actorId, companyId);
    if (!actorMembership) {
      throw new ForbiddenException('Actor is not a member of this company');
    }

    if (membership.role === Role.OWNER) {
      // Requirement: OWNER cannot be removed by ADMIN
      if (actorMembership.role === Role.ADMIN && actorMembership.userId !== membership.userId) {
        throw new ForbiddenException('Admins cannot remove Owners');
      }

      // Check if there are other owners
      const ownersCount = await this.membershipRepository.countByRole(companyId, Role.OWNER);
      if (ownersCount <= 1) {
        throw new ConflictException('Cannot remove the last OWNER');
      }
    }

    const removedMembership = await this.membershipRepository.remove(memberId);

    // Clear activeCompanyId if it matches
    const user = await this.userRepository.findById(removedMembership.userId);
    if (user && user.activeCompanyId === companyId) {
      await this.userRepository.update(user.id, { activeCompanyId: null });
    }

    return removedMembership;
  }
}
