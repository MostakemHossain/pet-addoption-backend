"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Pick_1 = __importDefault(require("../../../shared/Pick"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pet_constant_1 = require("./pet.constant");
const pet_service_1 = require("./pet.service");
const addAPet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield pet_service_1.petService.addAPet(user, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Add pet created Successfully",
        data: result,
    });
}));
const getAllPet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, Pick_1.default)(req.query, pet_constant_1.petFilterAbleFields);
    const options = (0, Pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield pet_service_1.petService.getAllPet(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pets retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getMyAddPetPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const filters = (0, Pick_1.default)(req.query, pet_constant_1.petFilterAbleFields);
    const options = (0, Pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield pet_service_1.petService.getMyAddPetPosts(filters, options, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pets retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updatePetProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield pet_service_1.petService.updatePetProfile(req.params.petId, req.body, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "my pets profile updated  successfully",
        data: result,
    });
}));
exports.petController = {
    addAPet,
    getAllPet,
    getMyAddPetPosts,
    updatePetProfile,
};
