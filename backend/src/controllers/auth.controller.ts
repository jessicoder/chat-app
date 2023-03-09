import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { responseOK } from '../helpers/http';

class AuthController {
  //localhost:3000/users: POST
  public async createUser(
    req: Request,
    res: Response,
    next?: NextFunction,
  ): Promise<any> {
    try {
      const reqBody = req.body;
      const data = await userService.createUser(reqBody);
      return responseOK(res, data);
    } catch (err) {
      if (next) {
        next(err);
      }
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const reqBody = req.body;
      const data = await userService.login(reqBody);
      return responseOK(res, data);
    } catch (err) {
      if (next) {
        next(err);
      }
    }
  }
}

export const authController = new AuthController();
