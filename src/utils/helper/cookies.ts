import { Response } from "express";
import path from "path";

export const accessTokenCookieOption = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "development",
    sameSite: "lax" as "lax" | "strict"| "none",
    maxAge: 15 * 60* 1000,
    path: "/",
}

export const refreshTokenCookieOption = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "development",
    sameSite: "lax" as "lax" | "strict"| "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
}

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, accessTokenCookieOption);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOption);
}

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken", {path: "/"});
    res.clearCookie("refreshToken", {path: "/"});
}

