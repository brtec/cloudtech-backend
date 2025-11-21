import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/presentation/controllers/auth.controller';
import { AuthUseCase } from '../../src/modules/auth/application/auth.use-case';
import { SignUpDto } from '../../src/modules/auth/presentation/dto/signup.dto';
import { LoginDto } from '../../src/modules/auth/presentation/dto/login.dto';
import { AcceptInviteDto } from '../../src/modules/auth/presentation/dto/accept-invite.dto';

const mockAuthUseCase = {
  signUp: jest.fn(),
  login: jest.fn(),
  acceptInvite: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthUseCase,
          useValue: mockAuthUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up a user', async () => {
    const dto: SignUpDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
    const result = { id: 'user-id', email: dto.email, name: dto.name };
    mockAuthUseCase.signUp.mockResolvedValue(result);

    expect(await controller.signUp(dto)).toEqual(result);
    expect(mockAuthUseCase.signUp).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto: LoginDto = { email: 'test@example.com', password: 'password' };
    const result = { accessToken: 'jwt-token' };
    mockAuthUseCase.login.mockResolvedValue(result);

    expect(await controller.login(dto)).toEqual(result);
    expect(mockAuthUseCase.login).toHaveBeenCalledWith(dto);
  });

  it('should accept invite', async () => {
    const dto: AcceptInviteDto = { token: 'valid-token' };
    mockAuthUseCase.acceptInvite.mockResolvedValue(undefined);

    await controller.acceptInvite(dto);
    expect(mockAuthUseCase.acceptInvite).toHaveBeenCalledWith(dto);
  });
});
