import express from "express";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getSingleData);
router.patch("/:id", adminController.updateData);

export const adminRouter = router;
