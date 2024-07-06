import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized");
      }
      const verifiedUser = await jwtHelpers.verifyToken(
        token,
        config.jwt__access_secret as string
      );
      req.user = verifiedUser;
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
