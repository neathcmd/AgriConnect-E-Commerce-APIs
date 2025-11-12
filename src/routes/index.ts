import { Router } from "express";
import AuthRouter from "./auth-route";

const router = Router();

// // Auth route
router.use("/auth", AuthRouter);

export default router;

