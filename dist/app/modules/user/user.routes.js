"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const fileUpload_1 = require("../../../shared/fileUpload");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post("/create-user", fileUpload_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidation.createUserValidationSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createUser(req, res, next);
});
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.userController.getAllUser);
router.get("/:userId", user_controller_1.userController.getSingleUser);
router.delete("/:userId", user_controller_1.userController.deleteAUser);
router.patch("/profile/update-my-profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), fileUpload_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
router.patch("/update-role-status/:userId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), user_controller_1.userController.updateUserRoleStatus);
router.get("/profile/me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), user_controller_1.userController.getMyProfile);
router.put("/update-role/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), user_controller_1.userController.updateRole);
exports.userRoutes = router;
