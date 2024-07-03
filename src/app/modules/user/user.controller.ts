import { Request, Response } from "express";
import pick from "../../../shared/Pick";
import { userFilterAbleFields } from "./user.constant";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};
const getAllUser = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, userFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await userServices.getAllUsers(filters, options);
    res.status(201).json({
      success: true,
      message: "User Retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.userId);
    res.status(201).json({
      success: true,
      message: "User is Retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};
export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
};
