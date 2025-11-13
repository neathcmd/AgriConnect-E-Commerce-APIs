import { Request, Response, NextFunction } from "express";
import { handleError } from "@/utils/response-util";
import crypto from "crypto";

// secure compare function
function secureCompare(a: string, b: string): boolean {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);

    if (aBuf.length !== bBuf.length) return false;

    return crypto.timingSafeEqual(aBuf, bBuf);
}

// Internal validation: freeze array to prevent mutations
function prepareRoles(roles: string[]): ReadonlyArray<string> {
    if (!Array.isArray(roles) || roles.length === 0) {
        throw new Error("authorizeRole: allowed roles must be a non-empty array.");
    }

    roles.forEach((r) => {
        if (typeof r !== "string" || !r.trim()) {
            throw new Error(`authorizeRole: invalid role value detected: "${r}".`);
        }
    });

    return Object.freeze([...new Set(roles)]);
}

// authorizeRole middleware
export const authorizeRole = (...allowedRoles: string[]) => {
    // Validate and sanitize roles ONCE at middleware creation
    const sanitizedRoles = prepareRoles(allowedRoles);

    return (req: Request, res: Response, next: NextFunction) => {
        try {             
            // Zero trust — never trust req.user fully
            const user = req.user;

            if (!user) {
                return handleError(res, 401, "Authentication required.");
            }

            const userRole = typeof user.role === "string" ? user.role.trim() : null;

            if (!userRole) {
                // Possible token tampering or missing DB value
                console.warn("[SECURITY] User object exists but role is missing or invalid.");
                return handleError(res, 400, "Invalid user role.");
            }

            // Check against allowed roles using time-safe compare
            const hasRole = sanitizedRoles.some((role) => secureCompare(role, userRole));

            if (!hasRole) {
                // Log attempt for auditing (exclude sensitive data)
                console.warn({
                    event: "ROLE_AUTHORIZATION_DENIED",
                    userId: user._id,
                    attemptedRole: userRole,
                    requiredRoles: sanitizedRoles,
                    timestamp: new Date().toISOString(),
                    ip: req.ip,
                });

                return handleError(res, 403, "You do not have permission to access this resource.");
            }

            // Debug (non-prod only)
            if (process.env.NODE_ENV !== "production") {
                console.log(
                    `[AUTH] Role authorized: user=${userRole} -> allowed=[${sanitizedRoles.join(
                        ", "
                    )}]`
                );
            }

            return next();
        } catch (error) {
            console.error("=== AUTHORIZE ROLE INTERNAL ERROR ===", error);
            return handleError(res, 500, "Authorization failure.");
        }
    };
};