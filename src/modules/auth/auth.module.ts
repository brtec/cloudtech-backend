import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthUseCase } from './application/auth.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUseCase, UserRepository, JwtStrategy],
  exports: [UserRepository],
})
export class AuthModule {}
