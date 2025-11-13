import { Router } from "express";
import AuthRouter from "./auth-route";
import UserRouter from "./user-route";

const router = Router();

// Auth route
router.use("/auth", AuthRouter);

// User Route
router.use("/", UserRouter)

export default router;

