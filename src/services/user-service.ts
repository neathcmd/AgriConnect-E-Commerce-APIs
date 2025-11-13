import { Request, Response } from "express";
import { UserModel } from "@/models/user-model";
import { notFoundError, databaseError } from "@/utils/helper/error-helper";
import { IUser } from "@/types/user-type";
import { handleSuccess } from "@/utils/response-util";

// Get all users service:
// This function queries the database to retrieve all user records
// and returns them to the client through the controller.
export const getAllUsersService = async () => {
    try {
        const fetchUser  = await UserModel.find<IUser>();
        if (fetchUser.length === 0) {
            throw notFoundError("USER NOT FOUND.")
        }

        return fetchUser;
    } catch (error) {
        console.error(error)
        throw databaseError("SOMETHING WENT WRONG")
    }
};

// Get users by Id
// This function queries the database to retriave user with the id from req params
// and return the data to the client through controller.
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
    throw databaseError("ERROR FETCHING USER BY ID");
  }
};

/**
 * Update user by ID
 * This function queries the database to retrieve a user's current data using their unique ID.
 * It then updates the user's information with the new data provided.
 * Finally, it returns the updated user data.
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
        throw databaseError("ERROR UPDATED DATA.")
    }
};

/*
 * Delete user service
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
        console.error(error);
        throw databaseError("FAILED TO DELETE USER.")
    }
};