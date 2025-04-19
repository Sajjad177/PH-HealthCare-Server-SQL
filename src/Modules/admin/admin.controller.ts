import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterFields } from "./admin.constant";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

const getAllAdmins = catchAsync(async (req, res) => {
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
});

const getSingleData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.singleDataFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin fetched successfully",
    data: result,
  });
});

const updateData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateDataInDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deletedData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deletedDataFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

const softDeletedData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deletedDataFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdmins,
  getSingleData,
  updateData,
  deletedData,
  softDeletedData,
};
