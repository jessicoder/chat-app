import { Types } from 'mongoose';
import { MessageDto } from 'src/dto/message';
import { UserDto } from '../dto/user';
import { RoomDto } from '../dto/room';
import { buildError, unauthorizedError } from '../helpers/error';
import MessageModel from '../models/Message';
import RoomModel from '../models/Room';
import UserModel, { IUser } from '../models/User';

class RoomService {
  public async getMessages(roomID: any, page: any): Promise<MessageDto[]> {
    try {
      const messages = await MessageModel.find({ roomIDs: { $exists: roomID } })
        .limit(10)
        .skip(page * 10)
        .lean();
      return messages;
    } catch (err) {
      console.log(`[error][getMessages]: error while get messages`);
      throw buildError(err);
    }
  }

  //localhost:3000/rooms/:id?keyword=
  public async findMessagesByKeyword(
    roomID: any,
    keyword: any,
  ): Promise<MessageDto[]> {
    try {
      const messages = MessageModel.find({
        roomIDs: { $exist: roomID },
        message: { $regex: keyword, $option: 'i' },
      })
        .limit(10)
        .lean();
      return messages;
    } catch (err) {
      console.log(
        `[error][findMessages]: error while find messages by keyword`,
      );
      throw buildError(err);
    }
  }

  public async getUsersBelongToRoom(roomID: any): Promise<UserDto[]> {
    try {
      const userIDs = (await RoomModel.findById(roomID)
        .select('userIDs')
        .lean()) as IUser[];

      if (userIDs === null) {
        return [];
      }

      const promises = await userIDs.map(async (id: any): Promise<UserDto> => {
        const user = await UserModel.findById(id).lean();

        if (user === null) {
          return {};
        }

        return {
          username: user?.username,
          avatar: user?.avatar,
          email: user?.email,
        };
      });

      const users = await Promise.all(promises);

      return users;
    } catch (err) {
      console.log(
        `[error][getUsersBelongToRoom]: error while get users belong to rooms`,
      );
      throw buildError(err);
    }
  }

  public async getOwnerOfRoom(roomID: any): Promise<UserDto> {
    try {
      const ownerID = await RoomModel.findById(roomID)
        .select('createdBy')
        .lean();
      const owner = await UserModel.findById(ownerID).lean();

      if (owner === null) {
        return {};
      }

      return {
        username: owner.username,
        avatar: owner.avatar,
        email: owner.email,
      };
    } catch (err) {
      console.log(`[error][getOwnerOfRoom]: error while get owner of room`);
      throw buildError(err);
    }
  }

  public async createRoom(
    userID: any,
    roomName: any,
    roomType: any,
  ): Promise<RoomDto> {
    try {
      const room = new RoomModel({
        _id: new Types.ObjectId(),
        roomName: roomName,
        roomType: roomType,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: userID,
        userIDs: new Array<string>(userID),
      });

      const savedDoc = await room.save();

      return {
        roomName: savedDoc.roomName,
        roomType: savedDoc.roomType,
        userIDs: savedDoc.userIDs,
      };
    } catch (err) {
      console.error(`[error][createRoom]: error while create a new room`);
      throw buildError(err);
    }
  }

  public async addUsersToRoom(
    roomID: any,
    creatorID: any,
    userIDs: any,
  ): Promise<RoomDto> {
    try {
      const room = await RoomModel.findById(roomID);
      const updatedUserIDs = room?.userIDs?.join(userIDs);
      const roomType =
        (updatedUserIDs != undefined && updatedUserIDs.length) > 1 ? 1 : 0;
      const updatedRoom = await room?.update(
        {},
        {
          createdBy: creatorID,
          userIDs: updatedUserIDs,
          roomType: roomType,
          editedAt: new Date(),
        },
      );

      return {
        roomName: updatedRoom?.roomName,
        roomType: updatedRoom?.roomType,
        createdBy: updatedRoom?.createdBy,
        userIDs: updatedRoom?.userIDs,
      };
    } catch (err) {
      console.log(`[error][addUsersToRoom]: error while add users to room`);
      throw buildError(err);
    }
  }

  public async deletedRoom(roomID: any, userID: any): Promise<RoomDto> {
    try {
      const room = await RoomModel.findById(roomID);

      if (room?.createdBy !== userID) {
        console.log(`[error][deletedRoom]: error while delete room`);
        throw unauthorizedError();
      }

      const deletedRoom = await room?.update({
        isDeleted: true,
        editedAt: new Date(),
      });

      return {
        roomName: deletedRoom?.roomName,
        roomType: deletedRoom?.roomType,
        createdBy: deletedRoom?.createdBy,
        userIDs: deletedRoom?.userIDs,
      };
    } catch (err) {
      console.log(`[error][deleteRoom]: error while delete room`);
      throw buildError(err);
    }
  }

  public async sendMessageToRoom(
    roomID: any,
    userID: any,
    message: any,
    messageType: any,
  ): Promise<MessageDto> {
    try {
      const createdMessage = new MessageModel({
        _id: new Types.ObjectId(),
        message: message,
        messageType: messageType,
        senderID: userID,
        roomIDs: roomID,
        isDeleted: false,
        createdAt: new Date(),
      });
      const savedDoc = await createdMessage.save();

      return {
        senderID: savedDoc.senderID,
        roomID: savedDoc.roomIDs,
        message: savedDoc.message,
        messageType: savedDoc.messageType,
      };
    } catch (err) {
      console.log(
        `[error][sendMessageToRoom]: error while send message to room`,
      );
      throw buildError(err);
    }
  }
}

export const roomService = new RoomService();
