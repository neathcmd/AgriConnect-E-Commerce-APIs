import { Request, Response } from "express";
import { UserModel } from "@/models/user-model";
import { notFoundError, unauthorizedError } from "@/utils/helper/error-helper";
import { IUser } from "@/types/user-type";
import { handleSuccess } from "@/utils/response-util";



/**
 * Create user service
 */
export const createUserService = async () => {
    // code here
}

/**
 * Get all users service
 */
export const getAllUsersService = async () => {
    try {
        const fetchUser  = await UserModel.find<IUser>();
        if (fetchUser.length === 0) {
            throw notFoundError("USER NOT FOUND.")
        }

        return fetchUser;
    } catch (error) {
        console.error(error)
        throw error;
    }
};

/**
 * Get user by ID service
 */
export const getUsersByIdService = async (req: Request, _res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      throw notFoundError("USER NOT FOUND.");
    }

    return user;
  } catch (error) {
    console.error("getUsersByIdService error:", error); 
    throw error;
  }
};

/**
 * Update user by ID
 */
export const updateUserByIdService = async (req: Request, _res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const users = await UserModel.findByIdAndUpdate( id, updatedData, {
            new: true,
            runValidators: true,
        } );

        if (!users) {
            throw notFoundError("USER NOT FOUND.")
        };

        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Delete user by Id
 */
export const deleteUserByIdService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleteUser = await UserModel.findByIdAndDelete( id );

        if (!deleteUser) {
            throw notFoundError("USER NOT FOUND.")
        };

        return handleSuccess(res, 200, "DELETED USER SUCCESSFULLY.")

    } catch (error) {
        throw error;
    }
};


/**
 * Get me service
 */
export const getMeService = async (req: Request) => {
    try {
        if (!req.user || !req.user._id) {
            throw unauthorizedError("TOKEN NOT FOUND");
        }

        const userProfile = await UserModel.findById(req.user._id).select("-password");

        if (!userProfile) {
            throw notFoundError("USER NOT FOUND");
        }

        return userProfile;

    } catch (error) {
        throw error;
    }
};
