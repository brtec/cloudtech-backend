import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    user: {
      create: jest.fn().mockImplementation((dto) => {
        if (dto.data.email === 'existing@example.com') {
          throw new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`email`)',
            { code: 'P2002', clientVersion: '4.0.0' },
          );
        }
        return Promise.resolve({
          id: '1',
          ...dto.data,
        });
      }),
      findUnique: jest.fn().mockImplementation(async ({ where: { email } }) => {
        if (email === 'test@example.com') {
          const hashedPassword = await bcrypt.hash('password123', 10);
          return Promise.resolve({
            id: '1',
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
          });
        }
        return Promise.resolve(null);
      }),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user and return it', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'new@example.com',
          password: 'password123',
          name: 'New User',
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('new@example.com');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 409 Conflict if email already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        })
        .expect(409)
        .then((res) => {
          expect(res.body.message).toBe('Unique constraint failed');
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should log in a user and return a JWT', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('should return a 401 error for wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .expect(401);
    });
  });
});
