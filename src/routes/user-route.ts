import { Router } from "express";
import { getAllUsersController, updateUserByIdController } from "@/controllers/user-controller";

const UserRouter = Router();

UserRouter.get("/users", getAllUsersController);
UserRouter.put("/users/:id", updateUserByIdController)

export default UserRouter;