import mongoose, { Types, Schema, Document } from "mongoose";
import { IProduct } from "@/types/product-type";

export interface IProductModel extends IProduct, Document {
    _id: Types.ObjectId;
}

const productSchema = new Schema<IProductModel>(
    {
        product_name: { 
            type: String, 
            required: [true, "Product name is required"],
            trim: true
        },

        product_des: { 
            type: String, 
            required: [true, "Product description is required"],
            trim: true
        },

        price: { 
            type: String, 
            required: [true, "Price is required"] 
        },

        stock: { type: Number },

        category: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"]
        },

        status: {
            type: String,
            enum: ["Available", "Unavailable"],
            default: "Available",
            required: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    },
    { 
        timestamps: true 
    }
);

export const ProductModel = mongoose.model<IProductModel>("Product", productSchema);
