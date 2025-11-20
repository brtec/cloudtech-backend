import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from '../../src/modules/membership/application/membership.service';
import { MembershipRepository } from '../../src/modules/membership/infrastructure/repositories/membership.repository';
import { UserRepository } from '../../src/modules/auth/infrastructure/repositories/user.repository';
import { Role } from '@prisma/client';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

const mockMembershipRepository = {
  create: jest.fn(),
  findByUserAndCompany: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  countByRole: jest.fn(),
};

const mockUserRepository = {
  findUserByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: MembershipRepository,
          useValue: mockMembershipRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    jest.clearAllMocks();
  });

  describe('removeMember', () => {
    it('should remove a member and clear activeCompanyId if matches', async () => {
      const companyId = 'company-id';
      const memberId = 'member-id';
      const userId = 'user-id';
      const actorId = 'actor-id';
      const membership = { id: memberId, companyId, userId, role: Role.MEMBER };
      const actorMembership = { id: 'actor-membership', companyId, userId: actorId, role: Role.OWNER };
      const user = { id: userId, activeCompanyId: companyId };

      mockMembershipRepository.findById.mockResolvedValue(membership);
      mockMembershipRepository.findByUserAndCompany.mockResolvedValue(actorMembership);
      mockMembershipRepository.remove.mockResolvedValue(membership);
      mockUserRepository.findById.mockResolvedValue(user);

      await service.removeMember(companyId, memberId, actorId);

      expect(mockMembershipRepository.remove).toHaveBeenCalledWith(memberId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, { activeCompanyId: null });
    });

    it('should throw ConflictException if trying to remove the last OWNER', async () => {
      const companyId = 'company-id';
      const memberId = 'member-id';
      const actorId = 'actor-id';
      const membership = { id: memberId, companyId, role: Role.OWNER };
      const actorMembership = { id: 'actor-membership', companyId, userId: actorId, role: Role.OWNER };

      mockMembershipRepository.findById.mockResolvedValue(membership);
      mockMembershipRepository.findByUserAndCompany.mockResolvedValue(actorMembership);
      mockMembershipRepository.countByRole.mockResolvedValue(1);

      await expect(service.removeMember(companyId, memberId, actorId)).rejects.toThrow(ConflictException);
    });

    it('should throw ForbiddenException if ADMIN tries to remove OWNER', async () => {
      const companyId = 'company-id';
      const memberId = 'member-id';
      const actorId = 'actor-id';
      const membership = { id: memberId, companyId, role: Role.OWNER };
      const actorMembership = { id: 'actor-membership', companyId, userId: actorId, role: Role.ADMIN };

      mockMembershipRepository.findById.mockResolvedValue(membership);
      mockMembershipRepository.findByUserAndCompany.mockResolvedValue(actorMembership);

      await expect(service.removeMember(companyId, memberId, actorId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateMemberRole', () => {
    it('should update role', async () => {
      const companyId = 'company-id';
      const memberId = 'member-id';
      const membership = { id: memberId, companyId, role: Role.MEMBER };

      mockMembershipRepository.findById.mockResolvedValue(membership);
      mockMembershipRepository.update.mockResolvedValue({ ...membership, role: Role.ADMIN });

      await service.updateMemberRole(companyId, memberId, Role.ADMIN);

      expect(mockMembershipRepository.update).toHaveBeenCalledWith(memberId, { role: Role.ADMIN });
    });

    it('should throw ConflictException if demoting the last OWNER', async () => {
      const companyId = 'company-id';
      const memberId = 'member-id';
      const membership = { id: memberId, companyId, role: Role.OWNER };

      mockMembershipRepository.findById.mockResolvedValue(membership);
      mockMembershipRepository.countByRole.mockResolvedValue(1);

      await expect(service.updateMemberRole(companyId, memberId, Role.ADMIN)).rejects.toThrow(ConflictException);
    });
  });
});
