import mongoose, { Types, Schema, Document } from "mongoose";
import { IUser } from "@/types/user-type";

export type UserRole = "admin" | "farmer" | "user";

export interface IUserModel extends IUser, Document {
  _id: Types.ObjectId;
  full_name: string;
  user_name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  accessToken: string;
}

const userSchema: Schema = new Schema<IUserModel>(
  {
    full_name: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true
    },
    accessToken: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserModel>("User", userSchema);
