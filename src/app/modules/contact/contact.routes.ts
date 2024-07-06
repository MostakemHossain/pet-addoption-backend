import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { contactController } from "./contact.controller";
import { contactValidation } from "./contact.validation";
const router = express.Router();

router.post(
  "/",
  validateRequest(contactValidation.postContactSchema),
  contactController.postAContact
);

export const contactRoutes = router;
