import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        responseBody = {
          ...responseBody,
          ...response,
        };
      } else {
         responseBody.message = response;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma Errors
      if (exception.code === 'P2002') {
        httpStatus = HttpStatus.CONFLICT;
        responseBody.message = 'Unique constraint failed';
        responseBody.statusCode = httpStatus;
      } else {
        this.logger.error(`Prisma Error: ${exception.message}`, exception.stack);
      }
    } else {
      this.logger.error(`Unhandled Exception: ${exception instanceof Error ? exception.message : exception}`, exception instanceof Error ? exception.stack : '');
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
