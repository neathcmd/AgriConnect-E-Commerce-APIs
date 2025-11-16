import { Request, Response } from "express";
import { 
    getAllUsersService, 
    getUsersByIdService, 
    updateUserByIdService, 
    deleteUserByIdService,
    getMeService
} from "@/services/user-service";
import { handleControllerError } from "@/utils/helper/controller-error-handler";
import { handleSuccess, handleError } from "@/utils/response-util";


export const getAllUsersController = async (_req: Request, res: Response) => {
    try {
        const userData = await getAllUsersService();
        // console.log(userData)
        return handleSuccess(res, 200, "GET USER SUCCESSFULLY.", userData)
        
    } catch (error) {
        // console.error(error);
        handleControllerError(res, error)
    }
}

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUsersByIdService(req, res);

    return handleSuccess(res, 200, "USER FETCHED SUCCESSFULLY", user)

  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateUserByIdController = async (req: Request, res: Response) => {
    try {
        const updateUser = await updateUserByIdService(req, res);

        return handleSuccess(res, 200, "USER UPDATED SUCCESSFULLY", updateUser)
    } catch (error) {
        handleControllerError(res, error)
    }
}

// delete user
export const deleteUserByIdController = async (req: Request, res: Response) => {
    const deleteUserResult = await deleteUserByIdService(req, res);
    return deleteUserResult;
}

// Get me 
export const getMeController = async (req: Request, res: Response) => {
    try {
        const userProfile = await getMeService(req);

        return handleSuccess(res, 200, "GET USER PROFILE SUCCESSFULLY", userProfile);
    } catch (error) {
        handleControllerError(res, error)
    }
}