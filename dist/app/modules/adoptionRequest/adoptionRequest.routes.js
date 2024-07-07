"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adoptionRequestRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const adoptionRequest_controller_1 = require("./adoptionRequest.controller");
const adoptionRequest_validation_1 = require("./adoptionRequest.validation");
const router = express_1.default.Router();
router.post("/post-a-request", (0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(adoptionRequest_validation_1.adoptionRequestValidation.postAdoptionRequestSchema), adoptionRequest_controller_1.adoptionRequestController.postAdoptionRequest);
router.get("/my-adoption-request", (0, auth_1.default)(client_1.UserRole.USER), adoptionRequest_controller_1.adoptionRequestController.getMyAdoptionRequest);
router.get("/all-adoption-request", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.SUPER_ADMIN), adoptionRequest_controller_1.adoptionRequestController.getallAdoptionRequest);
router.put("/adoption-requests/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(adoptionRequest_validation_1.adoptionRequestValidation.updateAdoptionRequestSchema), adoptionRequest_controller_1.adoptionRequestController.approvedAdoptionRequest);
exports.adoptionRequestRoutes = router;
