import { Test, TestingModule } from '@nestjs/testing';
import { InviteController } from '../../src/modules/invite/presentation/controllers/invite.controller';
import { InviteUseCase } from '../../src/modules/invite/application/invite.use-case';
import { CreateInviteDto } from '../../src/modules/invite/presentation/dto/create-invite.dto';
import { Role } from '@prisma/client';

const mockInviteUseCase = {
  createInvite: jest.fn(),
};

describe('InviteController', () => {
  let controller: InviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteController],
      providers: [
        {
          provide: InviteUseCase,
          useValue: mockInviteUseCase,
        },
      ],
    }).compile();

    controller = module.get<InviteController>(InviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an invite', async () => {
    const companyId = 'company-id';
    const dto: CreateInviteDto = { email: 'test@example.com', role: Role.MEMBER };
    const result = { id: 'invite-id', ...dto };
    mockInviteUseCase.createInvite.mockResolvedValue(result);

    expect(await controller.createInvite(companyId, dto)).toEqual(result);
    expect(mockInviteUseCase.createInvite).toHaveBeenCalledWith(companyId, dto);
  });
});
