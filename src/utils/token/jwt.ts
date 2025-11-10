import jwt, { SignOptions } from "jsonwebtoken";
import { tokenPayload } from "@/types/auth-type";


const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables");
}

/**
 * Generate Access and Refresh JWT tokens
 * @param payload - user payload for token
 * @returns { accessToken, refreshToken }
 */

export const generateTokens = (payload: tokenPayload): { accessToken: string; refreshToken: string } => {
    // access token options
    const accessTokenOptions: SignOptions = {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES || "15m") as SignOptions["expiresIn"],
    };

    // refresh token options
    const refreshTokenOptions: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES || "7d") as SignOptions["expiresIn"],
    };

    // access token short live
    const accessToken = jwt.sign(
        {
            _id: payload._id,
            email: payload.email,
            role: payload.role,
        },
        ACCESS_TOKEN_SECRET,
        accessTokenOptions
    );

    // refresh token long live
    const refreshToken = jwt.sign(
        {
            _id: payload._id,
            email: payload.email,
            role: payload.role,
        },
        REFRESH_TOKEN_SECRET,
        refreshTokenOptions
    );

    return { accessToken, refreshToken };
}