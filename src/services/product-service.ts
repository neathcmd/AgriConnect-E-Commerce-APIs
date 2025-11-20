// import { Request, Response } from "express";
import { ProductModel } from "@/models/product-model";
import { ProductPayload } from "@/types/product-type";
import { badRequestError } from "@/utils/helper/error-helper";
import { Types } from "mongoose";
import { UserRoleModel } from "@/models/user-roleModel";
import { IRoleModel } from "@/models/role-model";


// Create Product
export const createProductService = async (dataPayload: ProductPayload, user_id: IRoleModel | Types.ObjectId) => {
    
    const { product_name, product_des, price, category, status } = dataPayload;
    if (!product_name?.trim() || !product_des?.trim() || !category) {
        throw badRequestError("These field are requried.")
    };

    // quries role from the database
    const queryRole = await UserRoleModel.find({ user_id: user_id}).populate<{ role_id: IRoleModel }>("role_id");
    
    // Check if it has farmer role
    const isFarmer = queryRole.some((ur) => (ur.role_id as IRoleModel).name === "FARMER", "ADMIN");
    if (!isFarmer) {
        throw badRequestError("Only farmer and admin are able to post product.")
    };

    const newProduct = await ProductModel.create({
        product_name,
        product_des,
        price,
        category,
        status,
    });

    return newProduct;
};