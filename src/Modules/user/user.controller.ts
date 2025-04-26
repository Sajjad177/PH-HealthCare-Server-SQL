import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdminInDB(req.body, req.file);

    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Error creating admin",
      error: error,
    });
  }
};

export const userController = {
  createAdmin,
};
