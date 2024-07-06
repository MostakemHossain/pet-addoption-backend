import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/Pick";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { adoptionRequestFilterAbleFields } from "./adoptionRequest.constant";
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
const getMyAdoptionRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, adoptionRequestFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adoptionRequestService.getMyAdoptionRequest(
      user,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My ALL adoption request Successfully!",
      data: result,
    });
  }
);
const approvedAdoptionRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await adoptionRequestService.approvedAdoptionRequest(
      req.body,
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Adoption request updated successfully!",
      data: result,
    });
  }
);

const getallAdoptionRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filters = pick(req.query, adoptionRequestFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adoptionRequestService.allAdoptionRequest(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get ALL adoption request Successfully!",
      data: result,
    });
  }
);

export const adoptionRequestController = {
  postAdoptionRequest,
  getMyAdoptionRequest,
  approvedAdoptionRequest,
  getallAdoptionRequest,
};
