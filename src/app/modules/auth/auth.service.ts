import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { ILoginUser } from "./auth.interface";
const prisma = new PrismaClient();
const loginUser = async (payload: ILoginUser) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      isDeleted: false,
      status: "ACTIVE",
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
    config.jwt__access_secret as string,
    config.jwt__access_expire_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt__refresh_secret as string,
    config.jwt__refresh_expire_in as string
  );
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken,
    refreshToken,
  };
};
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt__refresh_secret as string
    );
  } catch (error) {
    throw new Error("You are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      isDeleted: false,
      status: "ACTIVE",
    },
  });
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt__access_expire_in as string,
    config.jwt__access_expire_in as string
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: "ACTIVE",
      isDeleted: false,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Incorrect password");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await prisma.user.update({
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
};
export const authService = {
  loginUser,
  refreshToken,
  changePassword,
};
