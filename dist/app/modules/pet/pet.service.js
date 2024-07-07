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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const fileUpload_1 = require("../../../shared/fileUpload");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const pet_constant_1 = require("./pet.constant");
const prisma = new client_1.PrismaClient();
const addAPet = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    let petPhotos = [];
    if (files && files.length > 0) {
        const uploadPromises = files.map((file) => fileUpload_1.fileUploader.uploadToCloudinary(file));
        const uploadResults = yield Promise.all(uploadPromises);
        petPhotos = uploadResults
            .filter((result) => !!result)
            .map((result) => result.secure_url);
    }
    req.body.userId = user.id;
    const result = yield prisma.pet.create({
        data: Object.assign(Object.assign({}, req.body), { name: req.body.name, species: req.body.species, breed: req.body.breed, age: req.body.age, size: req.body.size, location: req.body.location, description: req.body.description, temperament: req.body.temperament, medicalHistory: req.body.medicalHistory, adoptionRequirements: req.body.adoptionRequirements, petPhoto: petPhotos }),
    });
    return result;
});
const getAllPet = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, sortBy, page, sortOrder, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: pet_constant_1.petSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                // Ensure that the type of the value matches the expected type
                let value = filterData[key];
                if (key === "age") {
                    value = parseInt(value, 10);
                }
                return {
                    [key]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.pet.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma.pet.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getMyAddPetPosts = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, sortBy, page, sortOrder, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    andConditions.push({
        // @ts-ignore
        userId: user.id,
    });
    if (searchTerm) {
        andConditions.push({
            OR: pet_constant_1.petSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                let value = filterData[key];
                if (key === "age") {
                    value = parseInt(value, 10);
                }
                return {
                    [key]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.pet.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma.pet.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updatePetProfile = (petId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserIdAndPetUserIdMatch = yield prisma.pet.findUniqueOrThrow({
        where: {
            id: petId,
        },
    });
    //@ts-ignore
    if (isUserIdAndPetUserIdMatch.userId !== user.id) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are not authorized to update this pet");
    }
    const result = yield prisma.pet.update({
        where: {
            id: petId,
        },
        data: payload,
    });
    return result;
});
exports.petService = {
    addAPet,
    getAllPet,
    getMyAddPetPosts,
    updatePetProfile,
};
