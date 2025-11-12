import { Request, Response } from "express";
import bcrypt from "bcrypt";
// import { handleError } from "@/utils/response-util";
import { UserModel } from "@/models/user-model";
import { generateTokens } from "@/utils/token/jwt";  // Adjust the import path as needed
// import { tokenPayload } from "@/types/auth-type";
import { badRequestError, databaseError, notFoundError } from "@/utils/helper/error-helper";
import jwt from "jsonwebtoken";

// Register service
export const registerService = async (req: Request, res: Response) => {
    try {
        const { full_name, user_name, email, phone, password, role } = req.body;

        // Check if user already exists
        const existUser = await UserModel.findOne({ user_name , email });
        if (existUser) {
            throw badRequestError("User with this email or username already exists.")
        }

        // Hash the password
        const hashed = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = await UserModel.create({
            full_name,
            user_name,
            email,
            phone,
            password: hashed,
            role: role || "farmer"
        });

        // Generate JWT tokens
        const tokens = generateTokens({
            _id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role
        });

        // Set cookies for refresh tokens
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,  // Prevents JavaScript from accessing cookie
            secure: process.env.NODE_ENV === "development", // Use secure cookies in development
            // secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
            sameSite: "strict",  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Set cookies for access Token
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        })

        // Respond with new user data and access token
        const { password: _, ...userData } = newUser.toObject(); // Exclude password
        return res.status(201).json({
            message: "User registered successfully.",
            user: userData,
            accessToken: tokens.accessToken // Expose access token
        });

    } catch (error) {
        console.error("===REGISTER ERROR===", error);
        throw databaseError("Something went wrong.");
    }
};

// Refresh Token endpoint
export const refreshTokenService = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw notFoundError("No refreshToken was found.")
        };

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as { _id: string };

        const user = await UserModel.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            throw badRequestError("Invalid refresh token.")
        };

        // Generate new refresh token
        const { accessToken, refreshToken: newRefreshToken } = generateTokens({
            _id: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Update refreshtoken
        user.refreshToken = newRefreshToken;
        await user.save();

         // Update cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send access token
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({
          success: true,
          accessToken,
        });
        
    } catch (error) {
        console.error("===REFRESH TOKEN ERROR===", error);
        throw databaseError("Something went wrong,")
    }
};

// Login service
export const loginService = async (req: Request, res: Response) => {
    try {
        // Your code here
    } catch (error) {
        console.error("===LOGIN ERROR===", error)
        // Your code here
    }
}