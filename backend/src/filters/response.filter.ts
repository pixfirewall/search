import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const httpError = exception instanceof HttpException;
    const response = httpError
      ? (exception.getResponse() as Record<string, unknown>)
      : { message: exception.message };
    const status = httpError
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({
      meta: {
        success: false,
        code: 700,
      },
      data: null,
      error: {
        ...response,
        status,
        timestamp: new Date().toISOString(),
        path: req.url,
      },
    });
  }
}
