import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Invite, Prisma } from '@prisma/client';

@Injectable()
export class InviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.InviteCreateInput): Promise<Invite> {
    return this.prisma.invite.create({ data });
  }

  async findByEmailAndCompany(email: string, companyId: string): Promise<Invite | null> {
    return this.prisma.invite.findUnique({
      where: { email_companyId: { email, companyId } },
    });
  }

  async findByToken(token: string): Promise<Invite | null> {
    return this.prisma.invite.findUnique({ where: { token } });
  }

  async update(id: string, data: Prisma.InviteUpdateInput): Promise<Invite> {
    return this.prisma.invite.update({ where: { id }, data });
  }
}
