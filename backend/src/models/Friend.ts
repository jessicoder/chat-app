import { Schema, model, Types } from 'mongoose';

export interface IFriend {
  _id?: Types.ObjectId;
  senderID: string;
  recipientID: string;
  status: string;
  createdAt: Date;
  editedAt: Date;
}

const friendSchema = new Schema<IFriend>({
  _id: { type: Types.ObjectId },
  senderID: { type: String, required: true },
  recipientID: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, required: true },
  editedAt: { type: Date },
});

const friendModel = model<IFriend>('Friend', friendSchema);

export default friendModel;
