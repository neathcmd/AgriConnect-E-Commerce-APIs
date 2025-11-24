import { ProductModel } from "@/models/product-model";
import { ProductPayload } from "@/types/product-type";
import { badRequestError, notFoundError } from "@/utils/helper/error-helper";
import { Types } from "mongoose";
import { UserRoleModel } from "@/models/user-roleModel";
import { IRoleModel } from "@/models/role-model";
import { categoryModel } from "@/models/category-model";


/**
 * 
 * Create Product
 * @param dataPayload 
 * @param user_id 
 * @returns 
 */
export const createProductService = async (dataPayload: ProductPayload, user_id: IRoleModel | Types.ObjectId) => {
    
    const { product_name, product_des, price, category, status } = dataPayload;
    if (!product_name?.trim() || !product_des?.trim() || !category) {
        throw badRequestError("These field are requried.")
    };

    // quries role from the database
    const queryRole = await UserRoleModel.find({ user_id: user_id}).populate<{ role_id: IRoleModel }>("role_id");
    
    // Check if it has farmer role
    const hasPremission = queryRole.some(
    (ur) => ["FARMER", "ADMIN"].includes((ur.role_id as IRoleModel).name)
    );
    if (!hasPremission) {
        throw badRequestError("Only farmer and admin are able to post product.")
    };

    // Check if the category name exist.
    const categories = await categoryModel.findOne({ name: category});
    if (!categories) {
        throw notFoundError("Category not found.");
    }

    const newProduct = await ProductModel.create({
        product_name,
        product_des,
        price,
        category: categories,
        status: status || "",
    });

    return newProduct;
};

/**
 * Get all product and get product by Id
 */
export const getAllProductService = async () => {
    const products = await ProductModel.find().populate("category", "name").lean();

    if (products.length === 0) {
        throw notFoundError("No products found.");
    };

    return products;
}

