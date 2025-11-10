import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { handleError } from "@/utils/response-util";
import { tokenPayload } from "@/types/auth-type";

declare global {
    namespace Express {
        interface Request {
            user?: tokenPayload;
        }
    }
}

// Extract Bearer token from Authorization header
const extractBearerToken = (authHeader: string | undefined): string | null => {
    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
        return null;
    }

    return parts[1].trim();
};

// Validate JWT token middleware
const validatePayload = (payload: JwtPayload): tokenPayload | null => {
    if (
        typeof payload !== "object" ||
        !(payload._id && typeof payload._id === "string") ||
        !(payload.email && typeof payload.email === "string") ||
        !(payload.role && typeof payload.role === "string")
    ) {
        return null;
    }

    return {
        _id: payload._id,
        email: payload.email,
        role: payload.role,
    };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = extractBearerToken(authHeader);

        if (!token) {
            return handleError(res, 401, "Authentication token is missing.")
        }

        const secret = process.env.JWT_ACCES_SECRET;
        if (!secret || typeof secret !== "string") {
            console.error("[CRITICAL] Missing JWT_ACCESS_SECRET in environment.");
            return handleError(res, 500, "Server configuration error.");
        }

        // verify token
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, secret) as JwtPayload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return handleError(res, 401, "Token expired. Please refresh your session.");
            }
            if (error instanceof JsonWebTokenError) {
                return handleError(res, 401, "Malformed or invalid token.");
            }

            console.error("[JWT VERIFY ERROR]", error);
            return handleError(res, 500, "Unexpected token verification failure.");
        };

        // validate payload strictly
        const validatedUser = validatePayload(decoded);
        if (!validatedUser) {
            console.warn("[SECURITY] Token payload rejected due to invalid structure.", decoded);
            return handleError(res, 401, "Invalid token payload.");
        }

        // Assign user to request immutably
        req.user = Object.freeze({ ...validatedUser });

        // Debug logging for development
        if (process.env.NODE_ENV !== "production") {
            console.log(
                `[AUTH] TOKEN VALID -> user=${validatedUser.email}, role=${validatedUser.role}`
            );
        }

        return next();
    } catch (error) {
        console.error("[AUTHENTICATE TOKEN ERROR]", error);
        return handleError(res, 500, "Authentication process failed.");
    }
}