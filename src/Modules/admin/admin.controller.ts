import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterFields } from "./admin.constant";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    // there are filters
    const filters = pick(req.query, adminFilterFields);
    const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adminService.getAllAdminsFromDB(filters, option);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admins fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Error fetching admins",
      error: error,
    });
  }
};

const getSingleData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.singleDataFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateDataInDB(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deletedData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminService.deletedDataFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const softDeletedData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminService.deletedDataFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const adminController = {
  getAllAdmins,
  getSingleData,
  updateData,
  deletedData,
  softDeletedData,
};
