import mongoose, { Types, Schema, Document } from "mongoose";
import { IUser } from "@/types/user-type";

export interface IUserModel extends IUser, Document {
  _id: Types.ObjectId;
  // status: boolean;
  accessToken: string;
  refreshToken: string;
   
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
      enum: ["admin", "farmer", "customer"],
      default: "farmer",
      required: true
    },
    // status: { type: Boolean },
    accessToken: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserModel>("User", userSchema);
