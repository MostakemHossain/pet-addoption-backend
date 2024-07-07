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
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const sendMailer_1 = __importDefault(require("./sendMailer"));
const prisma = new client_1.PrismaClient();
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            isDeleted: false,
            status: "ACTIVE",
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Incorrect password");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt__access_secret, config_1.default.jwt__access_expire_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt__refresh_secret, config_1.default.jwt__refresh_expire_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt__refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are not authorized");
    }
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            isDeleted: false,
            status: "ACTIVE",
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt__access_expire_in, config_1.default.jwt__access_expire_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findFirstOrThrow({
        where: {
            email: user.email,
            status: "ACTIVE",
            isDeleted: false,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Incorrect password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password changed successfully",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: "ACTIVE",
            isDeleted: false,
        },
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.reset_password_token, config_1.default.reset_password_expire_in);
    const resetPassword_link = config_1.default.reset_password_link +
        `?userId=${userData.id}&token=${resetPasswordToken}`;
    yield (0, sendMailer_1.default)(userData.email, `
      <div>
      <p>Dear ${userData.name}</p>
      <p>Your reset password link:</p>
      <a href=${resetPassword_link}>
      <button>Click here to Reset Password</button>
      </a>
      </div>
        `);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: "ACTIVE",
            isDeleted: false,
        },
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.reset_password_token);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invalid credentials");
    }
    // hashed password
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password change successfully",
    };
});
exports.authService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
