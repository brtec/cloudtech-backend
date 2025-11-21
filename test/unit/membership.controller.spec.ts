import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from '../../src/modules/membership/presentation/controllers/membership.controller';
import { MembershipUseCase } from '../../src/modules/membership/application/membership.use-case';
import { AddMemberDto } from '../../src/modules/membership/presentation/dto/add-member.dto';
import { UpdateMemberDto } from '../../src/modules/membership/presentation/dto/update-member.dto';
import { Role } from '@prisma/client';

const mockMembershipUseCase = {
  addMember: jest.fn(),
  updateMemberRole: jest.fn(),
  removeMember: jest.fn(),
};

describe('MembershipController', () => {
  let controller: MembershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [
        {
          provide: MembershipUseCase,
          useValue: mockMembershipUseCase,
        },
      ],
    }).compile();

    controller = module.get<MembershipController>(MembershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a member', async () => {
    const companyId = 'company-id';
    const dto: AddMemberDto = { email: 'test@example.com', role: Role.MEMBER };
    const req = { user: { id: 'user-id' } };
    const result = { id: 'member-id', ...dto };
    mockMembershipUseCase.addMember.mockResolvedValue(result);

    expect(await controller.addMember(companyId, dto, req)).toEqual(result);
    expect(mockMembershipUseCase.addMember).toHaveBeenCalledWith(companyId, dto, req.user.id);
  });

  it('should update a member', async () => {
    const companyId = 'company-id';
    const memberId = 'member-id';
    const dto: UpdateMemberDto = { role: Role.ADMIN };
    const result = { id: memberId, ...dto };
    mockMembershipUseCase.updateMemberRole.mockResolvedValue(result);

    expect(await controller.updateMember(companyId, memberId, dto)).toEqual(result);
    expect(mockMembershipUseCase.updateMemberRole).toHaveBeenCalledWith(companyId, memberId, dto.role);
  });

  it('should remove a member', async () => {
    const companyId = 'company-id';
    const memberId = 'member-id';
    const req = { user: { id: 'user-id' } };
    mockMembershipUseCase.removeMember.mockResolvedValue(undefined);

    await controller.removeMember(companyId, memberId, req);
    expect(mockMembershipUseCase.removeMember).toHaveBeenCalledWith(companyId, memberId, req.user.id);
  });
});
