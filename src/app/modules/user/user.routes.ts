import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../shared/fileUpload";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
const router = express.Router();

router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createUserValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return userController.createUser(req, res, next);
  }
);
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllUser
);
router.get("/:userId", userController.getSingleUser);
router.delete("/:userId", userController.deleteAUser);

router.patch(
  "/profile/update-my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userController.updateMyProfile(req, res, next);
  }
);

router.patch(
  "/update-role-status/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.updateUserRoleStatus
);

router.get(
  "/profile/me",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  userController.getMyProfile
);
router.put(
  "/update-role/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.updateRole
);

export const userRoutes = router;
