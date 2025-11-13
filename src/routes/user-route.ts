import { Router } from "express";
import { getAllUsersController, updateUserByIdController } from "@/controllers/user-controller";

const UserRouter = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Get users successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
UserRouter.get("/users", getAllUsersController);


UserRouter.put("/users/:id", updateUserByIdController)

export default UserRouter;