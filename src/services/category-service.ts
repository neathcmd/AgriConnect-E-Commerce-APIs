import { badRequestError, notFoundError } from "@/utils/helper/error-helper";
import { categoryModel } from "@/models/category-model";
// import { ICategory } from "@/types/category-type";

/**
 * Create category service
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export const createCategoryService = async (name: string, des: string) => {

  // validate name field
  if (!name?.trim()) {
    throw badRequestError("Category name is required.");
  }

  /**
   * Use $regex to check if the category already exists, no matter the letter casing.
   * food - Food - FOOD are treat as the same value
   */
  const existingCategory = await categoryModel.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" }
  });

  if (existingCategory) {
    throw badRequestError("Category with this name already exists.");
  };

  /**
   * create new Category and saved in the database
   */
  const newCategory = await categoryModel.create({
    name: name.trim(),
    description: des?.trim(),
  });

  return newCategory;
};

// Get All categories
export const getAllCategoriesService = async () => {

  const categories = await categoryModel.find().lean(); // .lean() for performan
  
  // find() returns [] if nothing found → not null/undefined
  if (categories.length === 0) {
    throw notFoundError("No categories found.");
  }
  
  return categories; // return the data!
};