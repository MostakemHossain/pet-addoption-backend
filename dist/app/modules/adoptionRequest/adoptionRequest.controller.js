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
exports.adoptionRequestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Pick_1 = __importDefault(require("../../../shared/Pick"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const adoptionRequest_constant_1 = require("./adoptionRequest.constant");
const adoptionRequest_service_1 = require("./adoptionRequest.service");
const postAdoptionRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield adoptionRequest_service_1.adoptionRequestService.postAdoptionRequest(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Request for a Adoption Successfully!",
        data: result,
    });
}));
const getMyAdoptionRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const filters = (0, Pick_1.default)(req.query, adoptionRequest_constant_1.adoptionRequestFilterAbleFields);
    const options = (0, Pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield adoptionRequest_service_1.adoptionRequestService.getMyAdoptionRequest(user, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My ALL adoption request Successfully!",
        data: result,
    });
}));
const approvedAdoptionRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adoptionRequest_service_1.adoptionRequestService.approvedAdoptionRequest(req.body, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Adoption request updated successfully!",
        data: result,
    });
}));
const getallAdoptionRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, Pick_1.default)(req.query, adoptionRequest_constant_1.adoptionRequestFilterAbleFields);
    const options = (0, Pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield adoptionRequest_service_1.adoptionRequestService.allAdoptionRequest(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "get ALL adoption request Successfully!",
        data: result,
    });
}));
exports.adoptionRequestController = {
    postAdoptionRequest,
    getMyAdoptionRequest,
    approvedAdoptionRequest,
    getallAdoptionRequest,
};
