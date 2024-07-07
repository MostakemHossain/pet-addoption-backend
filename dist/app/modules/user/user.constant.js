"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSelectedFields = exports.userFilterAbleFields = exports.userSearchAbleFields = void 0;
exports.userSearchAbleFields = ["email", "name"];
exports.userFilterAbleFields = ["name", "email", "searchTerm", "status"];
exports.userSelectedFields = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    profilePhoto: true,
    isDeleted: true,
    createdAt: true,
    updatedAt: true,
};
