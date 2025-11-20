import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendInviteEmail(email: string, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/accept-invite/${token}`;
    await this.transporter.sendMail({
      from: `"CloudTech" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'You have been invited to join a company on CloudTech',
      html: `<p>Please click the following link to accept your invite:</p><p><a href="${url}">${url}</a></p>`,
    });
  }

  async sendNewUserPassword(email: string, plainPassword: string) {
    await this.transporter.sendMail({
      from: `"CloudTech" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Your CloudTech account has been created',
      html: `<p>Your account has been created. Use the password below to login and then change it:</p><p><b>${plainPassword}</b></p><p>Login at: ${this.configService.get<string>('FRONTEND_URL')}</p>`,
    });
  }
}
