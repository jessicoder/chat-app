import * as _ from 'lodash';
import { Request, Response } from 'express';
import { roomService } from '../services/room.service';
import { responseOK } from '../helpers/http';
import { getUserInfoFromToken } from '../utils/auth';
import { CustomRequest } from 'src/middlewares/auth';
import { JwtPayload } from 'jsonwebtoken';

class RoomController {
  //localhost:3000/users
  public async createRoom(req: Request, res: Response): Promise<any> {
    const userID = ((req as CustomRequest).token as JwtPayload)._id;
    const { roomName, roomType } = req.body;
    const data = await roomService.createRoom(userID, roomName, roomType);

    return responseOK(res, data);
  }

  //localhost:3000/rooms/:id/users
  public async addUsersToRoom(req: Request, res: Response): Promise<any> {
    const roomID = req.params.id;
    const userID = ((req as CustomRequest).token as JwtPayload)._id;
    const { userIDs } = req.body;
    const data = await roomService.addUsersToRoom(roomID, userID, userIDs);

    return responseOK(res, data);
  }

  //localhost:3000/users/:id/rooms/:id
  public async deleteRoom(req: Request, res: Response): Promise<any> {
    const userID = ((req as CustomRequest).token as JwtPayload)._id;
    const roomID = req.params.id;

    const data = await roomService.deletedRoom(roomID, userID);

    return responseOK(res, data);
  }

  //localhost:3000/rooms/:id/message
  public async sendMessageToRoom(req: Request, res: Response): Promise<any> {
    const roomID = req.params.id;
    const userID = ((req as CustomRequest).token as JwtPayload)._id;
    const { message, messageType } = req.body;
    const data = await roomService.sendMessageToRoom(
      roomID,
      userID,
      message,
      messageType,
    );

    return responseOK(res, data);
  }

  //localhost:3000/rooms/:id/messages
  public async getMessages(req: Request, res: Response): Promise<any> {
    const roomID = req.params.id;
    const page = req.query.p;
    const data = await roomService.getMessages(roomID, page);

    return responseOK(res, data);
  }

  //localhost:3000/rooms/:id/users
  public async getUsersBelongToRoom(req: Request, res: Response): Promise<any> {
    const roomID = req.params.id;
    const data = await roomService.getUsersBelongToRoom(roomID);

    return responseOK(res, data);
  }
}

export const roomController = new RoomController();
