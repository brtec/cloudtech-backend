import { Injectable, ConflictException } from '@nestjs/common';
import { InviteRepository } from '../infrastructure/repositories/invite.repository';
import { EmailService } from '../../email/application/email.service';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class InviteService {
  constructor(
    private readonly inviteRepository: InviteRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(companyId: string, email: string, role: Role) {
    const existingInvite = await this.inviteRepository.findByEmailAndCompany(email, companyId);
    if (existingInvite) {
      throw new ConflictException('Invite already exists for this email and company');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Invite expires in 7 days

    const invite = await this.inviteRepository.create({
      company: { connect: { id: companyId } },
      email,
      role,
      token,
      expiresAt,
    });

    await this.emailService.sendInviteEmail(email, token);

    return invite;
  }
}
