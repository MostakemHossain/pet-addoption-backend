import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { petService } from "./pet.service";

const addAPet = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await petService.addAPet(req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Add pet created Successfully",
      data: result,
    });
  }
);

export const petController = {
  addAPet,
};
