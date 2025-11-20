import { Router } from "express";
import { createCategoryController, getAllCategoriesController } from "@/controllers/category-controller";

const CateRouter = Router();

CateRouter.post("/categories", createCategoryController);
CateRouter.get("/categories", getAllCategoriesController);

export default CateRouter;