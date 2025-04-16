import { Request, Response } from "express";

import { adminService } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllAdminsFromDB(req.query);

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Error fetching admins",
      error: error,
    });
  }
};

export const adminController = {
  getAllAdmins,
};
