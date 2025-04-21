import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../Modules/auth/auth.utils";
import config from "../config";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError("You are not authorized", StatusCodes.UNAUTHORIZED);
      }

      const verifyUserData = verifyToken(token, config.JWT_SECRET as string);

      req.user = verifyUserData;

      if (roles.length && !roles.includes(verifyUserData.role)) {
        throw new AppError("You are not authorized", StatusCodes.UNAUTHORIZED);
      }

      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

export default auth;
