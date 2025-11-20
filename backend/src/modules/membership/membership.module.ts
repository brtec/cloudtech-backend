import { Module } from '@nestjs/common';
import { MembershipController } from './presentation/controllers/membership.controller';
import { MembershipService } from './application/membership.service';
import { MembershipUseCase } from './application/membership.use-case';
import { MembershipRepository } from './infrastructure/repositories/membership.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MembershipController],
  providers: [MembershipService, MembershipUseCase, MembershipRepository],
})
export class MembershipModule {}
