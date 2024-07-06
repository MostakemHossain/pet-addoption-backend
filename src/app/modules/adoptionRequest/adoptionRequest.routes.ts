import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { adoptionRequestController } from "./adoptionRequest.controller";
const router = express.Router();

router.post(
  "/post-a-request",
  auth(UserRole.USER),
  adoptionRequestController.postAdoptionRequest
);

export const adoptionRequestRoutes = router;
