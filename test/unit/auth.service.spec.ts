import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/application/auth.service';
import { UserRepository } from '../../src/modules/auth/infrastructure/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        JwtService,
        PrismaService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
