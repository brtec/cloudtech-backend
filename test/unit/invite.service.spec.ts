import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from '../../src/modules/invite/application/invite.service';
import { InviteRepository } from '../../src/modules/invite/infrastructure/repositories/invite.repository';
import { EmailService } from '../../src/modules/email/application/email.service';
import { Role } from '@prisma/client';

const mockInviteRepository = {
  findByEmailAndCompany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockEmailService = {
  sendInviteEmail: jest.fn(),
};

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteService,
        {
          provide: InviteRepository,
          useValue: mockInviteRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<InviteService>(InviteService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invite if one does not exist', async () => {
      const companyId = 'company-id';
      const email = 'test@example.com';
      const role = Role.MEMBER;
      const invite = { id: 'invite-id', email, companyId, role, token: 'token' };

      mockInviteRepository.findByEmailAndCompany.mockResolvedValue(null);
      mockInviteRepository.create.mockResolvedValue(invite);

      const result = await service.create(companyId, email, role);

      expect(result).toEqual(invite);
      expect(mockInviteRepository.create).toHaveBeenCalled();
      expect(mockEmailService.sendInviteEmail).toHaveBeenCalledWith(email, expect.any(String));
    });

    it('should update existing invite if one exists', async () => {
      const companyId = 'company-id';
      const email = 'test@example.com';
      const role = Role.ADMIN;
      const existingInvite = { id: 'invite-id', email, companyId, role: Role.MEMBER };
      const updatedInvite = { ...existingInvite, role };

      mockInviteRepository.findByEmailAndCompany.mockResolvedValue(existingInvite);
      mockInviteRepository.update.mockResolvedValue(updatedInvite);

      const result = await service.create(companyId, email, role);

      expect(result).toEqual(updatedInvite);
      expect(mockInviteRepository.update).toHaveBeenCalledWith(existingInvite.id, expect.objectContaining({ role }));
      expect(mockEmailService.sendInviteEmail).toHaveBeenCalledWith(email, expect.any(String));
    });
  });
});
