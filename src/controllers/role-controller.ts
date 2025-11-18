import { Request, Response } from "express";
// import { handleError } from "@/utils/response-util";
import { createRoleService } from "@/services/roles-service";

// create role
export const createRoleController = async (req: Request, res: Response) => {
    const result = await createRoleService(req, res);
    return result;
}