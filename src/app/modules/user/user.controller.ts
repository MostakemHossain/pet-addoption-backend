import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/Pick";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userFilterAbleFields } from "./user.constant";
import { userServices } from "./user.service";

export interface CustomRequest extends Request {
  user?: any;
  // file?: IFile;
}
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createUser(req);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: result,
    });
  }
);
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getSingleUser(req.params.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User is Retrieved successfully",
      data: result,
    });
  }
);
const deleteAUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.deleteAUser(req.params.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User is deleted successfully",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    const result = await userServices.updateMyProfile(user, req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Profile Updated Successfully",
      data: result,
    });
  }
);

const updateUserRoleStatus = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const result = await userServices.updateUserRoleStatus(
      req.params.userId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Updated User Role,status Successfully",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfile(user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My profile is retrieved Successfully",
      data: result,
    });
  }
);
const updateRole = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await userServices.updateRole(req.body, req.params.id, user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Role updated Successfully",
      data: result,
    });
  }
);
export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  deleteAUser,
  updateMyProfile,
  updateUserRoleStatus,
  getMyProfile,
  updateRole,
};
