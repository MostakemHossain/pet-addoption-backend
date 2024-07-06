import express from "express";
import { adoptionRequestRoutes } from "../modules/adoptionRequest/adoptionRequest.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { contactRoutes } from "../modules/contact/contact.routes";
import { petRoutes } from "../modules/pet/pet.routes";
import { userRoutes } from "../modules/user/user.routes";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/pets",
    route: petRoutes,
  },
  {
    path: "/contacts",
    route: contactRoutes,
  },
  {
    path: "/adoption-request",
    route: adoptionRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
