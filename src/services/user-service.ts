import { Request, Response } from "express";
import { UserModel } from "@/models/user-model";
import { badRequestError, notFoundError, unauthorizedError } from "@/utils/helper/error-helper";
// import { IUser } from "@/types/user-type";
import { handleSuccess } from "@/utils/response-util";
import { UserRoleModel } from "@/models/user-roleModel";
import { rolesModel } from "@/models/role-model";
import bcrypt from "bcrypt";



/**
 * Create user service
 */
export const createUserService = async (req: Request) => {
    try {
        const { full_name, user_name, email, phone, password } = req.body;

        // Check duplicate username/email
        const existing = await UserModel.findOne({
          $or: [{ user_name }, { email }]
        });
        if (existing) {
          throw badRequestError("USER WITH THIS USERNAME OR EMAIL ALREADY EXIST.");
        }
    
        // Hash password
        const hashed = await bcrypt.hash(password, 12);
    
        // Create user
        const newUser = await UserModel.create({
          full_name,
          user_name,
          email,
          phone,
          password: hashed,
        });
    
        // Assign default role: FARMER
        const defaultRole = await rolesModel.findOne({ name: "FARMER" });
        if (!defaultRole) throw new Error("DEFAULT ROLE NOT FOUND");
    
        await UserRoleModel.create({
          user_id: newUser._id,
          role_id: defaultRole._id,
        });
    
        // Prepare response without password & refreshToken
        const farmerObj = newUser.toObject();
        // delete farmerObj.password;
        // delete farmerObj.refreshToken;
    
        return farmerObj;

    } catch (error) {
        throw error;
    }
};


/**
 * Get all users service
 */
// export const getAllUsersService = async () => {
//     try {
//         const fetchUser  = await UserModel.find<IUser>();
//         if (fetchUser.length === 0) {
//             throw notFoundError("USER NOT FOUND.")
//         }

//         return fetchUser;
//     } catch (error) {
//         console.error(error)
//         throw error;
//     }
// };
/**
 * Stuck
 */
export const getAllUsersService = async () => {
  try {
    // use lean() to get plain JS objects (no Mongoose Document methods like toObject)
    const users = await UserModel.find().lean();
    console.log("User===============",users)

    // if (users.length === 0) {
    //   throw notFoundError("USER NOT FOUND.");
    // }

    // const results = await Promise.all(
    //   users.map(async (user) => {
    //     const userRoles = await UserRoleModel
    //       .find({ user_id: user._id })
    //       .populate("Role"); // populate role info

    //     return {
    //       ...user,
    //       roles: userRoles.map((r) => r.role_id), // extract the populated role
    //     };
    //   })
    // );

    return {
      message:"success"
    }
  } catch (error) {
    console.error(error);
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
