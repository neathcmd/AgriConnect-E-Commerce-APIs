import { Router } from "express";
import AuthRouter from "./auth-route";
import UserRouter from "./user-route";
import RoleRouter from "./role-route";
import CateRouter from "./category-route";

const router = Router();

// Auth route
router.use("/auth", AuthRouter);

// User Route
router.use("/", UserRouter);

router.use("/", RoleRouter);

router.use("/", CateRouter)

export default router;

