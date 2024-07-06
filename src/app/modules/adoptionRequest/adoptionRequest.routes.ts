import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { adoptionRequestController } from "./adoptionRequest.controller";
import { adoptionRequestValidation } from "./adoptionRequest.validation";
const router = express.Router();

router.post(
  "/post-a-request",
  auth(UserRole.USER),
  validateRequest(adoptionRequestValidation.postAdoptionRequestSchema),
  adoptionRequestController.postAdoptionRequest
);
router.get(
  "/my-adoption-request",
  auth(UserRole.USER),
  adoptionRequestController.getMyAdoptionRequest
);

export const adoptionRequestRoutes = router;
