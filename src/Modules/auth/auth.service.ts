import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import config from "../../config";
import { generateToken, verifyToken } from "./auth.utils";
import { UserStatus } from "../../generated/prisma";

const loginUserInfo = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus?.ACTIVE,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password not matched");
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string
  );

  // generate refresh token
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.JWT_REFRESH as string,
    config.JWT_REFRESH_IN as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const LoginRefreshToken = async (token: string) => {
  let decodedToken;

  try {
    decodedToken = verifyToken(token, config.JWT_REFRESH as string);

    if (!decodedToken) {
      throw new Error("Invalid token");
    }
  } catch (error) {
    throw new Error("You are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedToken?.email,
      status: UserStatus?.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changingPassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus?.ACTIVE,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isPasswordMatched) {
    throw new Error("Old password not matched");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

export const authService = {
  loginUserInfo,
  LoginRefreshToken,
  changingPassword,
};
