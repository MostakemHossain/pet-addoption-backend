import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { authController } from "./auth.controller";
const router = express.Router();
router.post("/login-user", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  authController.changePassword
);

export const authRoutes = router;
