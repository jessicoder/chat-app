import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { responseOK } from '../helpers/http';
import { UserDto } from '../dto/user';
import { auth, CustomRequest } from '../middlewares/auth';
import { JwtPayload } from 'jsonwebtoken';

class UserController {
  //localhost:3000/users: GET
  public async getUsers(req: Request, res: Response): Promise<any> {
    const username = req.query.username as string;
    let data: UserDto[] = [];

    if (!_.isEmpty(username)) {
      data = [await userService.getUserByUsername(username)];
    } else {
      data = await userService.getUsers();
    }
    return responseOK(res, data);
  }

  //localhost:3000/users/:id/friends
  public async getFriendList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userID = ((req as CustomRequest).token as JwtPayload)?._id;
      const data = await userService.getFriendList(userID);

      return responseOK(res, data);
    } catch (err) {
      next(err);
    }
  }

  //localhost:3000/users/:id/friend: POST
  public async addFriend(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userID = ((req as CustomRequest).token as JwtPayload)?._id;
      const reqBody = req.body;
      const data = await userService.addFriend(userID, reqBody);

      return responseOK(res, data);
    } catch (err) {
      next(err);
    }
  }

  //localhost:3000/users/:id/friend: PUT
  public async responseFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userID = ((req as CustomRequest).token as JwtPayload)._id;
      const { friendReqID, status } = req.body;
      const data = await userService.responseFriendRequest(
        userID,
        friendReqID,
        status,
      );

      return responseOK(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
