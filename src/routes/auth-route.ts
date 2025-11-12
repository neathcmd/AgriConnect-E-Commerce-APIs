// src/routes/auth-route.ts
import { Router } from "express";
import { registerController } from "@/controllers/auth-controller";

const AuthRouter = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: jonh cina
 *               user_name: 
 *                 type: string
 *                 example: jonh
 *               phone: 
 *                 type: string,
 *                 example: "000000000"
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.post("/register", registerController);

export default AuthRouter;
