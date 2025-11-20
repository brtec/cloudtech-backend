import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InviteUseCase } from '../../application/invite.use-case';
import { CreateInviteDto } from '../dto/create-invite.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Invite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('company/:id/invite')
export class InviteController {
  constructor(private readonly inviteUseCase: InviteUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create an invite and send an email' })
  @ApiResponse({ status: 201, description: 'Invite created and email sent successfully.' })
  async createInvite(@Param('id') companyId: string, @Body() createInviteDto: CreateInviteDto) {
    return this.inviteUseCase.createInvite(companyId, createInviteDto);
  }
}
