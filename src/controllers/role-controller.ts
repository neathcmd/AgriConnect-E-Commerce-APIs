import { Request, Response } from "express";
import { createRoleService } from "@/services/roles-service";
import { handleControllerError } from "@/utils/helper/controller-error-handler";
import { handleSuccess } from "@/utils/response-util";

/**
 * Create role controller
 */
export const createRoleController = async (req: Request, res: Response) => {
  try {
    const { name, des } = req.body;

    const result = await createRoleService(name, des);

    return handleSuccess(res, 201, "Create role successfully", result)

  } catch (error) {
    handleControllerError(res, error)
  }
};
