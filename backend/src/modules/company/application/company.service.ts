import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../infrastructure/repositories/company.repository';
import { CreateCompanyDto } from '../presentation/dto/create-company.dto';
import { UpdateCompanyDto } from '../presentation/dto/update-company.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const company = await this.companyRepository.create(createCompanyDto);
    await this.prisma.membership.create({
      data: {
        userId,
        companyId: company.id,
        role: Role.ADMIN,
      },
    });
    return company;
  }

  async findAllByUser(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    return this.companyRepository.findAllByUser(userId, skip, pageSize);
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyRepository.update(id, updateCompanyDto);
  }

  async remove(id: string) {
    return this.companyRepository.remove(id);
  }
}
