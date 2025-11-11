import mongoose, { Types, Schema, Document } from "mongoose";
import { IProduct } from "@/types/product-type";

export interface IProductModel extends IProduct, Document {
    _id: Types.ObjectId;
}

const productSchema = new Schema<IProductModel>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        stock: { type: Number, required: true },
        category: { type: String, required: true },
        status: { type: Boolean, required: true },
        user_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }
    }, 
    { 
        timestamps : true, 
    }
);

export const ProductModel = mongoose.model<IProductModel>("Product", productSchema);