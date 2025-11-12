import { Response } from "express";
import { AppError } from "@/utils/app-error";

export const handleControllerError = (res: Response, error: unknown) => {
  if (error instanceof AppError) {
    return res.status((error).statusCode).json({
      message: error.message,
    });
  }

  console.error("UNEXPECTED ERROR:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
