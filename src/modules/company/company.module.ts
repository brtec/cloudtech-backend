import { Module } from '@nestjs/common';
import { CompanyController } from './presentation/controllers/company.controller';
import { CompanyService } from './application/company.service';
import { CompanyUseCase } from './application/company.use-case';
import { CompanyRepository } from './infrastructure/repositories/company.repository';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyUseCase, CompanyRepository],
})
export class CompanyModule {}
