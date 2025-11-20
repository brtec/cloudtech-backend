import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CompanyUseCase } from '../../application/company.use-case';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Company')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyUseCase: CompanyUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully.' })
  @ApiResponse({ status: 409, description: 'Conflict.' })
  async create(@Body() createCompanyDto: CreateCompanyDto, @Req() req) {
    return this.companyUseCase.createCompany(createCompanyDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List companies for the current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully.' })
  async findAll(@Req() req, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.companyUseCase.getUserCompanies(req.user.id, page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single company by ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.companyUseCase.getCompanyById(id, req.user?.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({ status: 200, description: 'Company updated successfully.' })
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyUseCase.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully.' })
  async remove(@Param('id') id: string) {
    return this.companyUseCase.deleteCompany(id);
  }

  @Post(':id/switch')
  @ApiOperation({ summary: 'Switch active company' })
  @ApiResponse({ status: 200, description: 'Switched company successfully.' })
  async switchCompany(@Param('id') id: string, @Req() req) {
    return this.companyUseCase.switchCompany(id, req.user.id);
  }
}
