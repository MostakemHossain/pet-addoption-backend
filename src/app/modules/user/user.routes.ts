import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
const router = express.Router();

router.post(
  "/create-user",
  validateRequest(userValidation.createUserValidationSchema),
  userController.createUser
);
router.get("/", userController.getAllUser);
router.get("/:userId", userController.getSingleUser);
router.delete("/:userId", userController.deleteAUser);

export const userRoutes = router;
