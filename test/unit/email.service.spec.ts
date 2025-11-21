import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../src/modules/email/application/email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                EMAIL_HOST: 'smtp.example.com',
                EMAIL_PORT: 587,
                EMAIL_USER: 'test@example.com',
                EMAIL_PASS: 'password',
                FRONTEND_URL: 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transporter with correct config including tls rejectUnauthorized: false', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'password',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  });

  it('should send invite email', async () => {
    const email = 'invitee@example.com';
    const token = 'some-token';
    await service.sendInviteEmail(email, token);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"CloudTech" <test@example.com>',
      to: email,
      subject: 'You have been invited to join a company on CloudTech',
      html: expect.stringContaining('http://localhost:3000/accept-invite/some-token'),
    });
  });

  it('should send new user password email', async () => {
    const email = 'newuser@example.com';
    const password = 'plainPassword';
    await service.sendNewUserPassword(email, password);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"CloudTech" <test@example.com>',
      to: email,
      subject: 'Your CloudTech account has been created',
      html: expect.stringContaining(password),
    });
  });
});
