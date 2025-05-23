import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../generated/prisma";

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authController.changePassword
);

router.post(
  "/forgot-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authController.forgotPassword
);

router.post(
  "/reset-password",
//   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authController.resetPassword
);

export const authRouter = router;
