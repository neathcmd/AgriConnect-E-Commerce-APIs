import mongoose, { Types, Schema, Document } from "mongoose";
import { IProduct } from "@/types/product-type";


// export type ProductStatus = "ACTIVE" | "INACTIVE";
export interface IProductModel extends IProduct, Document {
    _id: Types.ObjectId;
    // status: ProductStatus;
}

const productSchema = new Schema<IProductModel>(
    {
        product_name: { type: String, required: true },
        // price: { type: Number, required: true },
        price: { type: String, required: true },
        // currency: { type: String, default: "USD" },
        category: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category", 
            required: true 
        },
        status: {
            type: String,
            enum: ["HAS STOCK", "OUT OF STOCK"],
            default: "HAS STOCK",
            required: true
        },
        // status: { type: Boolean, required: true },
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