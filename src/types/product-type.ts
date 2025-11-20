import { Types } from "mongoose";


export type ProductStatus = "HAS STOCK" | "OUT OF STOCK";
export interface IProduct {
    product_name: string;
    product_des: string;
    price: string;
    // currency: string;
    stock: Number;
    // category: string;
    category: Types.ObjectId;
    status: ProductStatus;
    user_id: Types.ObjectId;
}

export type ProductPayload = {
    product_name: string;
    price: string;
    // category: string;
    category: Types.ObjectId;
    status: ProductStatus;
}