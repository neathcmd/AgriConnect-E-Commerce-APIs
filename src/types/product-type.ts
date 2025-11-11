import {Types} from "mongoose";

export interface IProduct {
    name: string;
    price: Number;
    currency: string;
    stock: Number;
    category: string;
    status: boolean;
    user_id: Types.ObjectId;
}

export type ProductPayload = {
    name: string;
    price: string;
    category: string;
    status: boolean;
}