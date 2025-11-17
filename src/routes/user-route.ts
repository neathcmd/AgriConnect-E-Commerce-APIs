import { Router } from "express";
import { authenticateToken } from "@/middleware/authenticateToken";
import { authorizeRole } from "@/middleware/authorizeRole";
import { 
    getAllUsersController, 
    updateUserByIdController,
    getMeController
} from "@/controllers/user-controller";

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
UserRouter.get("/users",
    authenticateToken,
    authorizeRole("ADMIN"),
    getAllUsersController
);


UserRouter.put("/users/:id", updateUserByIdController)
UserRouter.get("/profile/me", authenticateToken, getMeController)

export default UserRouter;