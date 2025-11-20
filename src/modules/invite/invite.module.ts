import { Module } from '@nestjs/common';
import { InviteController } from './presentation/controllers/invite.controller';
import { InviteService } from './application/invite.service';
import { InviteUseCase } from './application/invite.use-case';
import { InviteRepository } from './infrastructure/repositories/invite.repository';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [InviteController],
  providers: [InviteService, InviteUseCase, InviteRepository],
})
export class InviteModule {}
