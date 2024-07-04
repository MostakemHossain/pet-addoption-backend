import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { ILoginUser } from "./auth.interface";
const prisma = new PrismaClient();
const loginUser = async (payload: ILoginUser) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Incorrect password");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    "skkskskrh8rhr8d3938hfn8838r3",
    "1d"
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    "skkskskrh8rhr8d3938hfn8838rdlfio3fioew3",
    "30d"
  );
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken,
    refreshToken,
  };
};
export const authService = {
  loginUser,
};
