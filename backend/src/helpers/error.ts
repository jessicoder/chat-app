import { AppException } from '../exceptions/app.exception';
import { HttpCode } from '../common/httpcode';

const buildError = (err: unknown): AppException => {
  let message = 'Internal server error';

  if (err instanceof Error) {
    message = err.message;
  }
  return new AppException({
    statusCode: HttpCode.INTERNAL,
    message: message,
  });
};

const unauthorizedError = (): AppException => {
  const message = '401 Unauthorized error';

  return new AppException({
    statusCode: HttpCode.UNAUTHENTICATED,
    message: message,
  });
};

export { buildError, unauthorizedError };
