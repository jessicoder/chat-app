import mongoose, { Schema, model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  avatar: string;
  isActive: boolean;
  createdAt: Date;
  editedAt: Date;
  isDeleted: boolean;
  roomIDs?: string[];
  friendIDs?: string[];
}

const userSchema = new Schema<IUser>({
  _id: { type: Types.ObjectId },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  avatar: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Date, required: true },
  editedAt: { type: Date },
  isDeleted: { type: Boolean },
  roomIDs: { type: Array<string> },
  friendIDs: { type: Array<string> },
});

userSchema.pre('save', async function save(next) {
  const user = this as mongoose.Document & IUser;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  if (!salt) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  return next();
});

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
