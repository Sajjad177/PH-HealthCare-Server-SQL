import { Response } from "express";

type IMeta = {
  page: number;
  limit: number;
  total: number;
};

type IResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: IMeta;
  data?: T;
};

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    statusCode: data.statusCode,
    meta: data?.meta,
    data: data.data,
  });
};
