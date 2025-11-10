import { Request, Response } from "express";
import { UserModel } from "@/models/user-model";
import { badRequestError } from "@/utils/helper/error-helper";
import { handleSuccess } from "@/utils/response-util";
import bcrypt from "bcrypt";


// Register service
export const registerService = async (req: Request, res: Response) => {
    try {

        const { full_name, user_name, email, password, role } = req.body;
        const existingUser = await UserModel.findOne({ user_name, email });

        if (existingUser) {
            throw badRequestError("User already exist with this email or username.")
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({
            full_name,
            user_name,
            email,
            password: hashPassword,
            role: role || "user",
        });

        await newUser.save();

        return handleSuccess(res, 200, "User registered successfully.")
    } catch (error) {
        console.error("===registerError===", error)
    }
}