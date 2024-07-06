import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
