import { Response } from "express";

export const handleError =(
    res: Response,
    status: number,
    message: string,
): Response => {
    return res.status(status).json({
        message,
    });
};

export const handleSuccess = (
  res: Response,
  status = 200,
  message = "Success",
  data?: unknown
): Response => {
  return res.status(status).json({
    message,
    data: data || null,
  });
};