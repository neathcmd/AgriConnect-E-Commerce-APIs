import { Request, Response, NextFunction } from "express";
import { handleError } from "@/utils/response-util";

export const authorizeRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return handleError(res, 401, "Unauthorized.");
      }

      // Check if any of the user's roles are in allowed roles
      const hasRole = req.user.roles.some((roles: string) => allowedRoles.includes(roles));
      if (!hasRole) {
        return handleError(res, 403, "Access forbidden.");
      }

      next();

    } catch (error) {
      console.error(error);
      return handleError(res, 500, "Unexpected error occurred");
    }
  };
};
