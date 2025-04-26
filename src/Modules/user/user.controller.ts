import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

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

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
};
