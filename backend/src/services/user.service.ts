import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserDto } from '../dto/user';
import UserModel from '../models/User';
import { buildError } from '../helpers/error';
import FriendModel from '../models/Friend';
import { FriendDto } from '../dto/friend';
import { SECRET_KEY } from '../middlewares/auth';
import { AppException } from '../exceptions/app.exception';
import { HttpCode } from '../common/httpcode';
import { GenericErrors } from '../common/errorcode';

class UserService {
  //localhost:3000/users?username=: GET
  public async getUserByUsername(username: string): Promise<UserDto> {
    try {
      const user = await UserModel.findOne(
        { username },
        { password: 0 },
      ).lean();
      if (user === null) {
        return {};
      }

      return {
        username: user.username,
        email: user.email,
      };
    } catch (err) {
      console.error(
        `[error][getUserByUsername]: error while retrieving user ${username}`,
        err,
      );
      throw buildError(err);
    }
  }

  // locahost:3000/users:GET
  public async getUsers(): Promise<UserDto[]> {
    try {
      const users = await UserModel.find({}, { password: 0 }).limit(10).lean();
      return users;
    } catch (err) {
      console.error(`[error][getUsers]: error while get users list`);
      throw buildError(err);
    }
  }

  //POST: localhost:3000/users
  public async createUser(reqBody: any): Promise<UserDto> {
    const { username, password, email, avatar } = reqBody;

    const user = new UserModel({
      _id: new Types.ObjectId(),
      username,
      password,
      email,
      avatar,
      createdAt: new Date(),
      isDeleted: false,
    });
    const savedDoc = await user.save();

    if (savedDoc === null) {
      throw new AppException({
        message: 'error while create new user',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: GenericErrors.WRONG_CREDENTIALS.code,
      });
    }
    return {
      username: savedDoc.username,
      email: savedDoc.email,
      avatar: savedDoc.avatar,
    };
  }

  public async login(reqBody: any): Promise<any> {
    const { email, password } = reqBody;
    const foundUser = await UserModel.findOne({ email: email }).lean();

    if (foundUser === null) {
      throw new AppException({
        message: 'Name of user is not correct',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: GenericErrors.WRONG_CREDENTIALS.code,
      });
    }

    const isMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isMatch) {
      throw new AppException({
        message: 'Password is not correct',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: GenericErrors.WRONG_CREDENTIALS.code,
      });
    }

    const token = jwt.sign({ _id: foundUser._id?.toString() }, SECRET_KEY, {
      expiresIn: '2 days',
    });

    return { token };
  }

  //localhost:3000/users/:id/friends :GET
  public async getFriendList(userID: any): Promise<any> {
    const user = await UserModel.findById(userID).select('friendIDs').lean();

    if (user === null || _.isEmpty(user.friendIDs)) {
      return [];
    }

    const friends = await UserModel.find({
      _id: { $in: user?.friendIDs },
    }).lean();

    if (friends === null) {
      throw new AppException({
        message: 'Can not found the user',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: GenericErrors.WRONG_CREDENTIALS.code,
      });
    }

    const friendsDto = await friends.map((friend) => {
      return {
        username: friend.username,
        email: friend.email,
        avatar: friend.avatar,
      };
    });

    return friendsDto;
  }

  //localhost:3000/users/:id/friend POST
  public async addFriend(senderID: any, recipientID: any): Promise<FriendDto> {
    const friend = new FriendModel({
      _id: new Types.ObjectId(),
      senderID: senderID,
      recipientID: recipientID,
      status: 'Pending Process',
      createdAt: new Date(),
    });

    if (friend === null) {
      throw new AppException({
        message: 'Your input is not correct',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: GenericErrors.USER_NOT_FOUND.code,
      });
    }
    const sender = await UserModel.findById(friend.senderID).lean();
    const recipient = await UserModel.findById(friend.recipientID).lean();

    if (sender === null || recipient === null) {
      throw new AppException({
        message: 'Your input is not correct',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: GenericErrors.USER_NOT_FOUND.code,
      });
    }

    return {
      senderName: sender.username,
      senderAvatar: sender.avatar,
      recipientName: recipient.username,
      recipientAvatar: recipient.avatar,
      status: friend.status,
    };
  }

  //localhost:300/users/:id/friends : PUT
  public async responseFriendRequest(
    userID: any,
    friendReqID: any,
    status: any,
  ): Promise<FriendDto> {
    const friendReq = await FriendModel.findOneAndUpdate(
      { _id: friendReqID, recipientID: userID },
      { status: status },
      { returnDocument: 'after' },
    );

    const sender = await UserModel.findById(friendReq?.senderID).lean();
    const recipient = await UserModel.findById(friendReq?.recipientID).lean();

    if (sender === null || recipient === null) {
      throw new AppException({
        message: '',
        statusCode: HttpCode.BAD_REQUEST,
        errorCode: '',
      });
    }

    return {
      senderName: sender.username,
      recipientName: recipient.username,
      senderAvatar: sender.avatar,
      recipientAvatar: recipient.avatar,
      status: friendReq?.status,
    };
  }
}
export const userService = new UserService();
