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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adoptionRequestService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const adoptionRequest_constant_1 = require("./adoptionRequest.constant");
const prisma = new client_1.PrismaClient();
const postAdoptionRequest = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.adoptionRequest.create({
        data: Object.assign(Object.assign({}, payload), { userId: user.id }),
    });
    return result;
});
const getMyAdoptionRequest = (user, params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, sortBy, page, sortOrder, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    // Ensure userId condition
    andConditions.push({
        userId: user.id,
    });
    console.log(searchTerm);
    if (searchTerm) {
        andConditions.push({
            OR: adoptionRequest_constant_1.adoptionRequestSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (key === "status") {
                    return {
                        [key]: {
                            equals: client_1.petStatus[filterData[key]],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.adoptionRequest.findMany({
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
    const total = yield prisma.adoptionRequest.count({
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
const approvedAdoptionRequest = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.adoptionRequest.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const allAdoptionRequest = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, sortBy, page, sortOrder, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    console.log(searchTerm);
    if (searchTerm) {
        andConditions.push({
            OR: adoptionRequest_constant_1.adoptionRequestSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (key === "status") {
                    return {
                        [key]: {
                            equals: client_1.petStatus[filterData[key]],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.adoptionRequest.findMany({
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
    const total = yield prisma.adoptionRequest.count({
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
exports.adoptionRequestService = {
    postAdoptionRequest,
    getMyAdoptionRequest,
    approvedAdoptionRequest,
    allAdoptionRequest,
};
