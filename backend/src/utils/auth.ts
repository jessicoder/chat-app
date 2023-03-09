import { Request } from 'express';

export const getUserInfoFromToken = (req: Request): any => {
  return req.headers.Authorization;
};
