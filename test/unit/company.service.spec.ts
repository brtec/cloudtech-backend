import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../src/modules/company/application/company.service';
import { CompanyRepository } from '../../src/modules/company/infrastructure/repositories/company.repository';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { Role } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockCompanyRepository = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockPrismaService = {
  membership: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  user: {
    update: jest.fn(),
  },
};

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: mockCompanyRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company and assign OWNER role', async () => {
      const createCompanyDto = { name: 'Test Company' };
      const userId = 'user-id';
      const company = { id: 'company-id', ...createCompanyDto };

      mockCompanyRepository.create.mockResolvedValue(company);
      mockPrismaService.membership.create.mockResolvedValue({});

      const result = await service.create(createCompanyDto, userId);

      expect(result).toEqual(company);
      expect(mockCompanyRepository.create).toHaveBeenCalledWith(createCompanyDto);
      expect(mockPrismaService.membership.create).toHaveBeenCalledWith({
        data: {
          userId,
          companyId: company.id,
          role: Role.OWNER,
        },
      });
    });
  });

  describe('switchCompany', () => {
    it('should switch active company if user is a member', async () => {
      const companyId = 'company-id';
      const userId = 'user-id';
      const company = { id: companyId, name: 'Test Company' };
      const membership = { userId, companyId };

      mockCompanyRepository.findById.mockResolvedValue(company);
      mockPrismaService.membership.findUnique.mockResolvedValue(membership);
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.switchCompany(companyId, userId);

      expect(result).toEqual({ message: 'Company switched successfully', companyId });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { activeCompanyId: companyId },
      });
    });

    it('should throw NotFoundException if company does not exist', async () => {
      mockCompanyRepository.findById.mockResolvedValue(null);

      await expect(service.switchCompany('invalid-id', 'user-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not a member', async () => {
      const companyId = 'company-id';
      const userId = 'user-id';
      const company = { id: companyId, name: 'Test Company' };

      mockCompanyRepository.findById.mockResolvedValue(company);
      mockPrismaService.membership.findUnique.mockResolvedValue(null);

      await expect(service.switchCompany(companyId, userId)).rejects.toThrow(ForbiddenException);
    });
  });
});
