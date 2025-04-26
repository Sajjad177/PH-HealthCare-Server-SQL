import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import config from "../../config";
import { generateToken, verifyToken } from "./auth.utils";
import { UserStatus } from "../../generated/prisma";
import { emailSender } from "../../utils/emailSender";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

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

const forgotUserPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus?.ACTIVE,
    },
  });

  // reset password token generation
  const resetPasswordToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.RESET_TOKEN as string,
    config.RESET_TOKEN_EXPIRES_IN as string
  );

  // send email with reset password link. [you can send userid or email in the link]
  const resetPasswordLink =
    config.RESET_PASSWORD_URL +
    `?email=${userData.email}&token=${resetPasswordToken}`;

  // send email logic here (e.g., using nodemailer)
  await emailSender(
    userData.email,
    `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
    <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">Hello ${userData.email.split("@")[0]},</h2>
      <p style="color: #555; font-size: 16px;">
        You requested to reset your password. Please click the button below to continue:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPasswordLink}" 
           style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="color: #999; font-size: 14px;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </div>
  `
  );
};

const resetUserPassword = async (
  payload: { email: string; password: string },
  token: string
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus?.ACTIVE,
    },
  });

  const isValidToken = verifyToken(token, config.RESET_TOKEN as string);
  if (!isValidToken) {
    throw new AppError("Invalid or expired token", StatusCodes.FORBIDDEN);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const authService = {
  loginUserInfo,
  LoginRefreshToken,
  changingPassword,
  forgotUserPassword,
  resetUserPassword,
};
