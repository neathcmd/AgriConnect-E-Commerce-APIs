import { badRequestError, notFoundError } from "@/utils/helper/error-helper";
import { categoryModel } from "@/models/category-model";
import { ICategory } from "@/types/category-type";

/**
 * Create category service
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export const createCategoryService = async (name: string, des?: string) => {
    try {
        if (!name?.trim()) {
            throw badRequestError("Category name is required.");
        }

        const cateName = name.trim();

        /**
         * Use $regex to check if the category already exists, no matter the letter casing.
         * food - Food - FOOD are treat as the same value
         */
        const existingCategory = await categoryModel.findOne({
          name: { $regex: `^${cateName}$`, $options: "i" }
        });
    
        if (existingCategory) {
          throw badRequestError("Category with this name already exists.");
        }
    
        /**
         * create new Category and saved in the database
         */
        const newCategory = await categoryModel.create({
          name: cateName,
          description: des?.trim(),
        });
    
        return newCategory;
    } catch (error) {
        console.error(error);
    }
};

// Get All categories
export const getAllCategoriesService = async () => {
    try {
        const categories = await categoryModel.find().lean(); // .lean() for performance

        // find() returns [] if nothing found → not null/undefined
        if (categories.length === 0) {
          throw notFoundError("No categories found.");
        }

        return categories; // return the data!
    } catch (error) {
        console.error(error);
    }
};