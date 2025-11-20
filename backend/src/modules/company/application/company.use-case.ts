import { Injectable } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from '../presentation/dto/create-company.dto';
import { UpdateCompanyDto } from '../presentation/dto/update-company.dto';

@Injectable()
export class CompanyUseCase {
  constructor(private readonly companyService: CompanyService) {}

  async createCompany(createCompanyDto: CreateCompanyDto, userId: string) {
    return this.companyService.create(createCompanyDto, userId);
  }

  async getUserCompanies(userId: string, page: number, pageSize: number) {
    return this.companyService.findAllByUser(userId, page, pageSize);
  }

  async getCompanyById(id: string) {
    return this.companyService.findOne(id);
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  async deleteCompany(id: string) {
    return this.companyService.remove(id);
  }
}
