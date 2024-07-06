import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/Pick";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { petFilterAbleFields } from "./pet.constant";
import { petService } from "./pet.service";

const addAPet = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await petService.addAPet(user, req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Add pet created Successfully",
      data: result,
    });
  }
);
const getAllPet = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, petFilterAbleFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await petService.getAllPet(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Pets retrieved successfully",
    data: result,
  });
});

export const petController = {
  addAPet,
  getAllPet,
};
