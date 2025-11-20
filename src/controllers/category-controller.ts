import { Request, Response, NextFunction } from "express";
import { createCategoryService, getAllCategoriesService } from "@/services/category-service";
import { handleSuccess } from "@/utils/response-util";

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, des } = req.body;

    const newCategory = await createCategoryService(name, des);

    return res.status(201).json({
      message: "Category created successfully.",
      data: newCategory,
    });
    
  } catch (error) {
    next(error); // Let error middleware handle it
  }
};

/**
 * 
 * @param _req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getAllCategoriesController = async (
  _req: Request, // not used, but keep for convention
  res: Response,
  next: NextFunction
) => {
  try {
    const allCategories = await getAllCategoriesService();

    return handleSuccess(
      res,
      200,
      "Categories retrieved successfully",
      allCategories
    );
  } catch (error) {
    next(error);
  }
};