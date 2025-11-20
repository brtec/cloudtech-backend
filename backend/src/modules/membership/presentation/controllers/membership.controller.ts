import { Controller, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MembershipUseCase } from '../../application/membership.use-case';
import { AddMemberDto } from '../dto/add-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Membership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('company/:id/members')
export class MembershipController {
  constructor(private readonly membershipUseCase: MembershipUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Add a member to a company' })
  @ApiResponse({ status: 201, description: 'Member added successfully.' })
  async addMember(@Param('id') companyId: string, @Body() addMemberDto: AddMemberDto) {
    return this.membershipUseCase.addMember(companyId, addMemberDto);
  }

  @Patch(':memberId')
  @ApiOperation({ summary: 'Update a member role' })
  @ApiResponse({ status: 200, description: 'Member updated successfully.' })
  async updateMember(
    @Param('id') companyId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membershipUseCase.updateMemberRole(companyId, memberId, updateMemberDto.role);
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member from a company' })
  @ApiResponse({ status: 204, description: 'Member removed successfully.' })
  async removeMember(@Param('id') companyId: string, @Param('memberId') memberId: string) {
    return this.membershipUseCase.removeMember(companyId, memberId);
  }
}
