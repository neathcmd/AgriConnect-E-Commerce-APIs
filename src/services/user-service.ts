import { Request, Response } from "express";
import { UserModel } from "@/models/user-model";
import { badRequestError, notFoundError, unauthorizedError } from "@/utils/helper/error-helper";
// import { IUser } from "@/types/user-type";
import { handleSuccess } from "@/utils/response-util";
import { UserRoleModel } from "@/models/user-roleModel";
import { rolesModel } from "@/models/role-model";
import bcrypt from "bcrypt";
import { UserPayload } from "@/types/user-type";



/**
 * Create user service
 */
export const createUserService = async (dataPayload: UserPayload) => {
  const { full_name, user_name, email, phone, password } = dataPayload;

  // Check duplicate username/email
  const existing = await UserModel.findOne({
    $or: [{ user_name }, { email }]
  });

  if (existing) {
    throw badRequestError("User with this email or username already exist.");
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
  if (!defaultRole) throw new Error("Default role not found.");

  await UserRoleModel.create({
    user_id: newUser._id,
    role_id: defaultRole._id,
  });
  
  // Prepare response without password & refreshToken
  const farmerObj = newUser.toObject();
  // delete farmerObj.password;
  // delete farmerObj.refreshToken;
  return farmerObj;
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
};


/**
 * Get user by ID service
 */
export const getUsersByIdService = async (req: Request, _res: Response) => {

    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      throw notFoundError("User not found.");
    }

    return user;

};

/**
 * Update user by ID
 */
export const updateUserByIdService = async (req: Request, _res: Response) => {

  const { id } = req.params;

  const updatedData = req.body;

  const users = await UserModel.findByIdAndUpdate( id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!users) {
    throw notFoundError("User not found")
  };

  return users;

};

/**
 * Delete user by Id
 */
export const deleteUserByIdService = async (req: Request, res: Response) => {

  const { id } = req.params;
  const deleteUser = await UserModel.findByIdAndDelete( id )

  if (!deleteUser) {
    throw notFoundError("User not found..")
  }

  return handleSuccess(res, 200, "Delete user successfully.")
}


/**
 * Get me service
 */
export const getMeService = async (req: Request) => {

  if (!req.user || !req.user._id) {
    throw unauthorizedError("Token not found.");
  }
  
  const userProfile = await UserModel.findById(req.user._id).select("-password")
  if (!userProfile) {
    throw notFoundError("User not found.");
  }
  
  return userProfile;

};
