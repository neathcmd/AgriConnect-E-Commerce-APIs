import { Types } from "mongoose";
import { cartModel } from "@/models/cart-model";
import { ProductModel } from "@/models/product-model";
import { notFoundError, badRequestError } from "@/utils/helper/error-helper";

/**
 * Get cart service
 */
export const getCartService = async ( userId: string ) => {
    const cart = await cartModel.findOne({ userId }).populate("Product.productId").lean();
    return cart;
};

/**
 * add to cart service
 */
export const addToCartService = async (userId: string, productId: string, quantity: number) => {
    if (quantity <= 0) throw badRequestError("Quantity must be at least 1");

    // ensure product exists
    const product = await ProductModel.findById(productId).lean();
    if (!product) throw notFoundError("Product not found");

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
        const created = await cartModel.create({
            userId: new Types.ObjectId(userId),
            products: [{ productId: new Types.ObjectId(productId), quantify: quantity}],
        });
        return created;
    }

    // find product in cart
}