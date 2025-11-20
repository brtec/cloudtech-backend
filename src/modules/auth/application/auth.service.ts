import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { EmailService } from '../../email/application/email.service';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(email: string, pass: string, name: string): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });
  }

  async login(email: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !await bcrypt.compare(pass, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async acceptInvite(token: string): Promise<void> {
    const invite = await this.prisma.invite.findUnique({ where: { token } });
    if (!invite || invite.expiresAt < new Date()) {
      throw new NotFoundException('Invite not found or has expired');
    }

    // Try to find an existing user by the invite email
  let user: any = await this.userRepository.findUserByEmail(invite.email);
  let createdNewUser = false;
  let plainPassword: string | null = null;

    if (!user) {
      // create a new user with a generated password
      plainPassword = randomBytes(6).toString('hex');
      user = await this.createUser(invite.email, plainPassword, invite.email.split('@')[0]);
      createdNewUser = true;
    }

    const existingMembership = await this.prisma.membership.findFirst({
      where: { userId: user.id, companyId: invite.companyId },
    });
    if (existingMembership) {
      // Clean up invite and return
      await this.prisma.invite.delete({ where: { id: invite.id } });
      throw new ConflictException('User is already a member of this company');
    }

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        companyId: invite.companyId,
        role: invite.role,
      },
    });

    // delete invite
    await this.prisma.invite.delete({ where: { id: invite.id } });

    // send password email only if we created the user now
    if (createdNewUser && plainPassword) {
      await this.emailService.sendNewUserPassword(invite.email, plainPassword);
    }
  }
}
