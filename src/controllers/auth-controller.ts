import { Request, Response } from "express";
import { registerService } from "@/services/auth-service";

// Register controller
export const registerController = async (req: Request, res: Response) => {
    const registerResult = await registerService(req, res);
    return registerResult;
};