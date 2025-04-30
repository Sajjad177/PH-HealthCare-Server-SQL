import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../shared/pick";
import { adminFilterFields } from "../admin/admin.constant";
import { userFilterableFields } from "./user.constant";

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

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctorInDB(req.body, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatientInDB(req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getAllUsersFromDB(filters, option);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.updateStatusFromDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Status updated successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getMyProfileFromDB(req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  updateStatus,
  getMyProfile,
};
