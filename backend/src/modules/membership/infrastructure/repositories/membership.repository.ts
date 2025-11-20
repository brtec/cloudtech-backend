import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Membership, Prisma } from '@prisma/client';

@Injectable()
export class MembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MembershipCreateInput): Promise<Membership> {
    return this.prisma.membership.create({ data });
  }

  async findByUserAndCompany(userId: string, companyId: string): Promise<Membership | null> {
    return this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
  }

  async update(id: string, data: Prisma.MembershipUpdateInput): Promise<Membership> {
    return this.prisma.membership.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Membership> {
    return this.prisma.membership.delete({ where: { id } });
  }
}
