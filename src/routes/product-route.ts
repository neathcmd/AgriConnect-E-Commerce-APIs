import { Router } from "express";
import { createProductController } from "@/controllers/product-controller";
import { authenticateToken } from "@/middleware/authenticateToken";
import { authorizeRole } from "@/middleware/authorizeRole";

const ProductRouter = Router();

ProductRouter.post("/products", 
    authenticateToken, 
    authorizeRole("ADMIN"), 
    createProductController
);

export default ProductRouter;