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
    console.log(req.files);
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
    meta: result.meta,
    data: result.data,
  });
});
const getMyAddPetPosts = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, petFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await petService.getMyAddPetPosts(filters, options, user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Pets retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);
const updatePetProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await petService.updatePetProfile(
      req.params.petId,
      req.body,
      user
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "my pets profile updated  successfully",
      data: result,
    });
  }
);

export const petController = {
  addAPet,
  getAllPet,
  getMyAddPetPosts,
  updatePetProfile,
};
