import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../presentation/dto/signup.dto';
import { LoginDto } from '../presentation/dto/login.dto';
import { AcceptInviteDto } from '../presentation/dto/accept-invite.dto';

@Injectable()
export class AuthUseCase {
  constructor(private readonly authService: AuthService) {}

  async signUp(signUpDto: SignUpDto) {
    return this.authService.createUser(signUpDto.email, signUpDto.password, signUpDto.name);
  }

  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  async acceptInvite(acceptInviteDto: AcceptInviteDto) {
    return this.authService.acceptInvite(acceptInviteDto.token);
  }
}
