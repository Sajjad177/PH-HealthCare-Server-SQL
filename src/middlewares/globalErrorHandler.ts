import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: error.message || "Something went wrong",
    error: error,
  });
  next();
};

export default globalErrorHandler;
