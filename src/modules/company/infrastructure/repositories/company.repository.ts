import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async findAllByUser(userId: string, skip: number, take: number): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      skip,
      take,
    });
  }

  async findById(id: string): Promise<Company | null> {
    // Select explicit user fields to avoid referencing columns that may not exist
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Company> {
    return this.prisma.company.delete({ where: { id } });
  }
}
