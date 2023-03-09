import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { unauthorizedError } from '../helpers/error';
import { errorHandler } from './errorHandler';

export const SECRET_KEY = 'OanhNguyen@3K';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const verified = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = verified;

    next();
  } catch (err) {
    const authErr = unauthorizedError();
    next(authErr);
  }
};
