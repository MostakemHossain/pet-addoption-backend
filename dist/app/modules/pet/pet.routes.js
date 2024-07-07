"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const fileUpload_1 = require("../../../shared/fileUpload");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const pet_controller_1 = require("./pet.controller");
const pet_validation_1 = require("./pet.validation");
const router = express_1.default.Router();
router.post("/add-a-pet", (0, auth_1.default)(client_1.UserRole.USER), fileUpload_1.fileUploader.upload.array("file", 3), (req, res, next) => {
    req.body = pet_validation_1.petValidation.createPetValidationSchema.parse(JSON.parse(req.body.data));
    return pet_controller_1.petController.addAPet(req, res, next);
});
router.get("/all", pet_controller_1.petController.getAllPet);
router.get("/my-pet-posts", (0, auth_1.default)(client_1.UserRole.USER), pet_controller_1.petController.getMyAddPetPosts);
router.put("/:petId", (0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(pet_validation_1.petValidation.updatePetValidationSchema), pet_controller_1.petController.updatePetProfile);
exports.petRoutes = router;
