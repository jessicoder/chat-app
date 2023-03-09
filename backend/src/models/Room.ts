import { Schema, model, Types } from 'mongoose';

export interface IRoom {
  _id?: Types.ObjectId;
  roomName: string;
  roomType: boolean;
  isDeleted: boolean;
  createdAt: Date;
  editedAt: Date;
  createdBy: string;
  userIDs?: string[];
  blockIDs?: string[];
}

const roomSchema = new Schema<IRoom>({
  _id: { type: Types.ObjectId },
  roomName: { type: String, require: true },
  roomType: { type: Boolean, require: true },
  isDeleted: { type: Boolean },
  createdAt: { type: Date, require: true },
  editedAt: { type: Date },
  createdBy: { type: String, require: true },
  userIDs: { type: Array<string> },
  blockIDs: { type: Array<string> },
});

const roomModel = model<IRoom>('Room', roomSchema);

export default roomModel;
