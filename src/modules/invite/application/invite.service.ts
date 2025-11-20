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
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Invite expires in 7 days

    const existingInvite = await this.inviteRepository.findByEmailAndCompany(email, companyId);
    if (existingInvite) {
      // Update existing invite
      const updatedInvite = await this.inviteRepository.update(existingInvite.id, {
        token,
        expiresAt,
        role,
      });
      await this.emailService.sendInviteEmail(email, token);
      return updatedInvite;
    }

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
