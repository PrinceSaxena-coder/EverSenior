import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    // TEMPORARY DEBUG LOGGING
    console.error(
      '========== REAL BACKEND ERROR ==========',
    );
    console.error(exception);

    if (exception instanceof Error) {
      console.error('Error name:', exception.name);
      console.error('Error message:', exception.message);
      console.error('Error stack:', exception.stack);
    }

    console.error(
      '=========================================',
    );

    const ctx = host.switchToHttp();

    const request =
      ctx.getRequest<
        Request & { requestId?: string }
      >();

    const response =
      ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload =
      exception instanceof HttpException
        ? exception.getResponse()
        : undefined;

    const message =
      typeof payload === 'object' &&
      payload &&
      'message' in payload
        ? (payload as { message: unknown }).message
        : 'Internal server error';

    response.status(status).json({
      error: {
        code:
          status === 500
            ? 'INTERNAL_SERVER_ERROR'
            : `HTTP_${status}`,

        message: Array.isArray(message)
          ? 'Validation failed'
          : String(message),

        ...(Array.isArray(message)
          ? { details: message }
          : {}),

        requestId:
          request.requestId ?? null,
      },
    });
  }
}