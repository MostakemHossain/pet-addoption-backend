import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/Pick";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { contactFilterAbleFields } from "./contact.constant";
import { contactService } from "./contact.service";

const postAContact = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.postAContact(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Contact post successfully!",
    data: result,
  });
});
const getAllContact = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, contactFilterAbleFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await contactService.getAllContact(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "All Contact retrieved successfully!",
    data: result,
  });
});
const deleteAContact = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.deleteAContact(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Contact deleted successfully!",
    data: result,
  });
});
export const contactController = {
  postAContact,
  getAllContact,
  deleteAContact,
};
