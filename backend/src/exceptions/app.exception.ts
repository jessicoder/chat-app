import { ErrorData } from '../common/types';

export class AppException extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;

  constructor(errData: ErrorData) {
    super(errData.message);
    this.errorCode = errData.errorCode || '';
    this.statusCode = errData.statusCode;
    Error.captureStackTrace(this);
  }
}
