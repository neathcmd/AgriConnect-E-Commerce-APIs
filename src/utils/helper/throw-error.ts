import { ApiErrorType } from "@/types/error-type";

export const throwError = (statusCode: number, message: string): ApiErrorType => {
    const error = new Error(message) as ApiErrorType;
    error.statusCode = statusCode;
    return error;
};