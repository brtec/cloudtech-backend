import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthUseCase } from '../../application/auth.use-case';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AcceptInviteDto } from '../dto/accept-invite.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authUseCase.signUp(signUpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authUseCase.login(loginDto);
  }

  @Post('accept-invite')
  @ApiOperation({ summary: 'Accept a pending invite' })
  @ApiResponse({ status: 200, description: 'Invite accepted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async acceptInvite(@Body() acceptInviteDto: AcceptInviteDto) {
    return this.authUseCase.acceptInvite(acceptInviteDto);
  }
}
