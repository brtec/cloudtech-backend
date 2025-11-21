import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    return this.prisma.$transaction(async (prisma) => {
      const company = await prisma.company.create({
        data: createCompanyDto,
      });

      await prisma.membership.create({
        data: {
          userId,
          companyId: company.id,
          role: Role.OWNER,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { activeCompanyId: company.id },
      });

      return company;
    });
  }

  async findAllByUser(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    return this.companyRepository.findAllByUser(userId, skip, pageSize);
  }

  async findOne(id: string, userId?: string) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // If userId is provided, ensure the user is a member of the company
    if (userId) {
      const membership = await this.prisma.membership.findUnique({
        where: {
          userId_companyId: {
            userId,
            companyId: id,
          },
        },
      });

      if (!membership) {
        throw new ForbiddenException('User is not a member of this company');
      }
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyRepository.update(id, updateCompanyDto);
  }

  async remove(id: string) {
    return this.companyRepository.remove(id);
  }

  async switchCompany(companyId: string, userId: string) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of this company');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { activeCompanyId: companyId },
    });

    return { message: 'Company switched successfully', companyId };
  }
}
