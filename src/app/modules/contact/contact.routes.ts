import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { contactController } from "./contact.controller";
import { contactValidation } from "./contact.validation";
const router = express.Router();

router.post(
  "/",
  validateRequest(contactValidation.postContactSchema),
  contactController.postAContact
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  contactController.getAllContact
);
router.delete(
  "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  contactController.deleteAContact
);

export const contactRoutes = router;
