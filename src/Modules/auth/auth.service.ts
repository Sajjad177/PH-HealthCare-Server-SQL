import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import config from "../../config";
import { generateToken } from "./auth.utils";



const loginUserInfo = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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

export const authService = {
  loginUserInfo,
};
