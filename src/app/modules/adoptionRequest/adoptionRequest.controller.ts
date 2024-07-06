import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { adoptionRequestService } from "./adoptionRequest.service";

const postAdoptionRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await adoptionRequestService.postAdoptionRequest(
      user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Request for a Adoption Successfully!",
      data: result,
    });
  }
);

export const adoptionRequestController = {
  postAdoptionRequest,
};
