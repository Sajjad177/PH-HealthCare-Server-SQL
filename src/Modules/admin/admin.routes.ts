import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validation";
import { z } from "zod";
import { adminValidation } from "./admin.validation";

const router = express.Router();

router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getSingleData);
router.patch(
  "/:id",
  validateRequest(adminValidation.update),
  adminController.updateData
);
router.delete("/:id", adminController.deletedData);
router.put("/soft-delete/:id", adminController.softDeletedData);

export const adminRouter = router;
