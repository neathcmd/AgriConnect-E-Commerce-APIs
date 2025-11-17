import { Types } from "mongoose";
import { IRoleModel } from "@/models/roleModel";

export type IRole = {
    name: string;
    des: string;
}

export interface IUser_role {
  user_id: Types.ObjectId;
  role_id: IRoleModel | Types.ObjectId;
}
