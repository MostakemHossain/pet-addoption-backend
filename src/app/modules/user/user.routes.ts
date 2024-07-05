import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../shared/fileUpload";
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
router.get("/", userController.getAllUser);
router.get("/:userId", userController.getSingleUser);
router.delete("/:userId", userController.deleteAUser);

export const userRoutes = router;
