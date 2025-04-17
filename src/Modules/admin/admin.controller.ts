import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterFields } from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    // there are filters
    const filters = pick(req.query, adminFilterFields);
    const option = pick(req.query, ["limit", "page"]);
    const result = await adminService.getAllAdminsFromDB(filters, option);

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
