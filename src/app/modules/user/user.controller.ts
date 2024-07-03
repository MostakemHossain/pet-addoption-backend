import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/Pick";
import sendResponse from "../../../shared/sendResponse";
import { userFilterAbleFields } from "./user.constant";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.createUser(req);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, userFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await userServices.getAllUsers(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};
const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.getSingleUser(req.params.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User is Retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const deleteAUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.deleteAUser(req.params.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User is deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  deleteAUser,
};
