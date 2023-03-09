import { Response } from 'express';
import { HttpCode } from '../common/httpcode';

const responseOK = (responser: Response, data: any, meta: any = {}) => {
  return responser.status(HttpCode.OK).json({
    meta: meta,
    data: data,
  });
};

export { responseOK };
