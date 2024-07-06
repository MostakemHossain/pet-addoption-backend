import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../../config";
import AppError from "../../../errors/AppError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { IChangePassword, ILoginUser } from "./auth.interface";
import emailSender from "./sendMailer";
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
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Incorrect password");
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
    throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized");
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

const changePassword = async (user: any, payload: IChangePassword) => {
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
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Incorrect password");
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

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
      isDeleted: false,
    },
  });
  const resetPasswordToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.reset_password_token as string,
    config.reset_password_expire_in as string
  );
  const resetPassword_link =
    config.reset_password_link +
    `?userId=${userData.id}&token=${resetPasswordToken}`;
  await emailSender(
    userData.email,
    `
      <div>
      <p>Dear ${userData.name}</p>
      <p>Your reset password link:</p>
      <a href=${resetPassword_link}>
      <button>Click here to Reset Password</button>
      </a>
      </div>
        `
  );
};

const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: "ACTIVE",
      isDeleted: false,
    },
  });
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.reset_password_token as string
  );
  if (!isValidToken) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid credentials");
  }
  // hashed password
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
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
    message: "Password change successfully",
  };
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
