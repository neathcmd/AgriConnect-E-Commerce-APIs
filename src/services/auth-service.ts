import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "@/models/user-model";
import { generateTokens } from "@/utils/token/jwt";
import { UserPayload } from "@/types/user-type";
import { 
    badRequestError, 
    notFoundError, 
    databaseError, 
    unauthorizedError
} from "@/utils/helper/error-helper";

type JwtDecoded = { _id: string };

/**
 * Refresh tokens: verify incoming refresh token, ensure it matches DB,
 * generate new tokens and rotate the stored refresh token.
 */
export const refreshTokenService = async (refreshToken: string) => {
    try {
        if (!refreshToken) {
            throw notFoundError("NO REFRESH TOKEN FOUND.");
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as JwtDecoded;

        const user = await UserModel.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            throw unauthorizedError("INVALID REFRESH TOKEN.");
        }

        // rotate tokens
        const tokens = generateTokens({
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        user.refreshToken = tokens.refreshToken;
        await user.save();

        return tokens;

    } catch (err: any) {
        console.error("refreshTokenService error:", err);
        // If it's a JWT verification error, surface as unauthorized
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
            throw unauthorizedError("INVALID OR EXPIRED REFRESH TOKEN.");
        }
        throw databaseError("REFRESH TOKEN ERROR.");
    }
}


/**
 * Register a new user, hash password, store refresh token, return user (without sensitive fields) and tokens
 */
export const registerService = async (data: UserPayload) => {
    try {
        const { full_name, user_name, email, phone, password } = data;

        const existUser = await UserModel.findOne({
            $or: [{ user_name }, { email }],
        });

        if (existUser) {
            throw badRequestError("USER WITH THIS USERNAME OR EMAIL ALREADY EXIST.");
        }

        const hashed = await bcrypt.hash(password, 12);

        const newUser = await UserModel.create({
            full_name,
            user_name,
            email,
            phone,
            password: hashed,
        });

        const tokens = generateTokens({
            _id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
        });

        newUser.refreshToken = tokens.refreshToken;
        await newUser.save();

        const userObj = newUser.toObject();
        // remove sensitive fields
        // delete userObj.password;
        // delete userObj.refreshToken;

        return { user: userObj };

    } catch (err) {
        console.error("registerService error:", err);
        throw databaseError("REGISTRATION ERROR");
    }
};


/**
 * Login user: validate credentials, rotate refresh token, return user + tokens
 */
export const loginService = async (data: UserPayload) => {
    try {
        const { user_name, password } = data;

        const existingUser = await UserModel.findOne({ user_name });
        if (!existingUser) {
            throw notFoundError("USER NOT FOUND.");
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            throw unauthorizedError("INVALID USERNAME OR PASSWORD.");
        }

        const tokens = generateTokens({
            _id: existingUser._id.toString(),
            email: existingUser.email,
            role: existingUser.role,
        });

        existingUser.refreshToken = tokens.refreshToken;
        const savedUser = await existingUser.save();

        const userObj = savedUser.toObject();
        // delete userObj.password;
        // delete userObj.refreshToken;

        return {
            tokens,
            user: userObj,
        };

    } catch (err) {
        console.error("loginService error:", err);
        throw databaseError("LOGIN ERROR.");
    }
};


/**
 * Logout: find user by refreshToken and clear it
 */
export const logoutService = async (refreshToken: string) => {
    try {
        if (!refreshToken) {
            throw notFoundError("NO TOKEN FOUND.")
        }

        const logoutUser = await UserModel.findOne({ refreshToken });
        if (!logoutUser) {
            throw unauthorizedError("INVALID TOKEN.");
        }

        logoutUser.refreshToken = "";
        await logoutUser.save();
    } catch (err) {
        console.error("logoutService error:", err);
        throw databaseError("LOGOUT ERROR");
    }
};
