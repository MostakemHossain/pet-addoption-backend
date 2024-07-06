import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../shared/fileUpload";
import auth from "../../middlewares/auth";
import { petController } from "./pet.controller";
import { petValidation } from "./pet.validation";
const router = express.Router();

router.post(
  "/add-a-pet",
  auth(UserRole.USER),
  fileUploader.upload.array("file", 3),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = petValidation.createPetValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return petController.addAPet(req, res, next);
  }
);

router.get("/all", petController.getAllPet);
router.get(
  "/my-pet-posts",
  auth(UserRole.USER),
  petController.getMyAddPetPosts
);

export const petRoutes = router;
