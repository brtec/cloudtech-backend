import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../../src/modules/company/presentation/controllers/company.controller';
import { CompanyUseCase } from '../../src/modules/company/application/company.use-case';
import { CreateCompanyDto } from '../../src/modules/company/presentation/dto/create-company.dto';
import { UpdateCompanyDto } from '../../src/modules/company/presentation/dto/update-company.dto';

const mockCompanyUseCase = {
  createCompany: jest.fn(),
  getUserCompanies: jest.fn(),
  getCompanyById: jest.fn(),
  updateCompany: jest.fn(),
  deleteCompany: jest.fn(),
  switchCompany: jest.fn(),
};

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyUseCase,
          useValue: mockCompanyUseCase,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a company', async () => {
    const dto: CreateCompanyDto = { name: 'New Company' };
    const req = { user: { id: 'user-id' } };
    const result = { id: 'company-id', ...dto };
    mockCompanyUseCase.createCompany.mockResolvedValue(result);

    expect(await controller.create(dto, req)).toEqual(result);
    expect(mockCompanyUseCase.createCompany).toHaveBeenCalledWith(dto, req.user.id);
  });

  it('should find all user companies', async () => {
    const req = { user: { id: 'user-id' } };
    const result = { data: [], total: 0 };
    mockCompanyUseCase.getUserCompanies.mockResolvedValue(result);

    expect(await controller.findAll(req)).toEqual(result);
    expect(mockCompanyUseCase.getUserCompanies).toHaveBeenCalledWith(req.user.id, 1, 10);
  });

  it('should find one company', async () => {
    const id = 'company-id';
    const req = { user: { id: 'user-id' } };
    const result = { id, name: 'Test Company' };
    mockCompanyUseCase.getCompanyById.mockResolvedValue(result);

    expect(await controller.findOne(id, req)).toEqual(result);
    expect(mockCompanyUseCase.getCompanyById).toHaveBeenCalledWith(id, req.user.id);
  });

  it('should update a company', async () => {
    const id = 'company-id';
    const dto: UpdateCompanyDto = { name: 'Updated Company' };
    const result = { id, ...dto };
    mockCompanyUseCase.updateCompany.mockResolvedValue(result);

    expect(await controller.update(id, dto)).toEqual(result);
    expect(mockCompanyUseCase.updateCompany).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a company', async () => {
    const id = 'company-id';
    mockCompanyUseCase.deleteCompany.mockResolvedValue(undefined);

    await controller.remove(id);
    expect(mockCompanyUseCase.deleteCompany).toHaveBeenCalledWith(id);
  });

  it('should switch company', async () => {
    const id = 'company-id';
    const req = { user: { id: 'user-id' } };
    mockCompanyUseCase.switchCompany.mockResolvedValue({ message: 'success' });

    await controller.switchCompany(id, req);
    expect(mockCompanyUseCase.switchCompany).toHaveBeenCalledWith(id, req.user.id);
  });
});
