import { Response } from 'express';
import { HttpCode } from '../common/httpcode';
import { AppException } from '../exceptions/app.exception';

class ErrorHandler {
  public handleError(err: Error | AppException, responser?: Response) {
    if (!responser) {
      throw err;
    }
    if (err instanceof AppException) {
      responser.status(err.statusCode).json({
        errorCode: err.errorCode,
        message: err.message,
      });
      return;
    }
    responser.status(HttpCode.INTERNAL).json({
      message: 'Internal server error',
      cause: err.message,
    });
  }
}

export const errorHandler = new ErrorHandler();
