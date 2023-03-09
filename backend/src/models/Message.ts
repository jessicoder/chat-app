import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  _id?: Types.ObjectId;
  message: string;
  messageType: boolean;
  senderID: string;
  isDeleted: boolean;
  createdAt: Date;
  editedAt: Date;
  roomIDs?: string[];
}

const messageSchema = new Schema<IMessage>({
  _id: { type: Types.ObjectId },
  message: { type: String },
  messageType: { type: Boolean, required: true },
  senderID: { type: String, required: true },
  isDeleted: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
  editedAt: { type: Date },
  roomIDs: { type: Array<string>, required: true },
});

const messageModel = model<IMessage>('Message', messageSchema);

export default messageModel;
