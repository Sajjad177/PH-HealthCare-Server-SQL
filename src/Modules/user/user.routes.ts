import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../generated/prisma";
import { upload } from "../../utils/imageUploader";
import validateRequest from "../../middlewares/validation";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.createAdmin),
  userController.createAdmin
);

export const userRouter = router;
