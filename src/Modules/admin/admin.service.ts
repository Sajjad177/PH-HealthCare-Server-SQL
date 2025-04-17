//TODO: 1- if searchTerm then show searchTerm data else show all data
//TODO: 2- Search by name or email contains
//TODO: 3- if filterData then show filterData data
//TODO: 4- dymaic way to sorting data
//TODO: 5- formula = (page - 1) * limit

import { Prisma, PrismaClient } from "../../generated/prisma";
import { paginationHelpers } from "../../utils/pagination";
import { searchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any, option: any) => {
  const { limit, page, sortBy, sortOrder, skip } = paginationHelpers(option);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.AdminWhereInput[] = [];

  //*1
  if (searchTerm) {
    andConditions.push({
      //*2
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //*3
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const where: Prisma.AdminWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.admin.findMany({
    where,
    //*4
    orderBy:
      option.sortBy && option.sortOrder
        ? {
            [option.sortBy]: option.sortOrder,
          }
        : { createdAt: "asc" },
    skip,
    take: limit,
  });

  return result;
};

export const adminService = {
  getAllAdminsFromDB,
};
