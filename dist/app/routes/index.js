"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adoptionRequest_routes_1 = require("../modules/adoptionRequest/adoptionRequest.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const contact_routes_1 = require("../modules/contact/contact.routes");
const pet_routes_1 = require("../modules/pet/pet.routes");
const user_routes_1 = require("../modules/user/user.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/pets",
        route: pet_routes_1.petRoutes,
    },
    {
        path: "/contacts",
        route: contact_routes_1.contactRoutes,
    },
    {
        path: "/adoption-request",
        route: adoptionRequest_routes_1.adoptionRequestRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
