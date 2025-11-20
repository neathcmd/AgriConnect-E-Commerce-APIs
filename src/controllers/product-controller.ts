import { Request, Response } from "express";
import { createProductService } from "@/services/product-service";
import { handleControllerError } from "@/utils/helper/controller-error-handler";
import { ProductPayload } from "@/types/product-type";

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createProductController = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get user from auth middleware
    const user = (req as any).user;
    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 2️⃣ Get product payload from body
    const dataPayload: ProductPayload = req.body;

    // 3️⃣ Call service
    const product = await createProductService(dataPayload, user._id);

    // 4️⃣ Return success
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    // 5️⃣ Use advanced error handler
    handleControllerError(res, error);
  }
};
