import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { MembershipModule } from './modules/membership/membership.module';
import { InviteModule } from './modules/invite/invite.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CompanyModule,
    MembershipModule,
    InviteModule,
    EmailModule,
  ],
})
export class AppModule {}
