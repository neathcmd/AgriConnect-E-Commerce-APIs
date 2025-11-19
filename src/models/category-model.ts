import mongoose, { Types, Schema, Document } from "mongoose";
import { ICategory } from "@/types/category-type";

export interface ICategoryModel extends ICategory, Document {
    _id: Types.ObjectId;
}

const categorySchema = new Schema<ICategoryModel>(
    {
        name: { type: String, required: true, unique: true },
        des: { type: String }
    }, 
    { timestamps: true }
)

export const categoryModel = mongoose.model<ICategoryModel>("Category", categorySchema)