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
router.get(
  "/all-adoption-request",
  // auth(UserRole.SUPER_ADMIN, UserRole.SUPER_ADMIN),
  adoptionRequestController.getallAdoptionRequest
);
router.put(
  "/adoption-requests/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adoptionRequestValidation.updateAdoptionRequestSchema),
  adoptionRequestController.approvedAdoptionRequest
);

export const adoptionRequestRoutes = router;
