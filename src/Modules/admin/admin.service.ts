//TODO: 1- if searchTerm then show searchTerm data else show all data
//TODO: 2- Search by name or email contains
//TODO: 3- if filterData then show filterData data
//TODO: 4- dymaic way to sorting data
//TODO: 5- formula = (page - 1) * limit

import {
  Admin,
  Prisma,
  PrismaClient,
  UserStatus,
} from "../../generated/prisma";
import { prisma } from "../../shared/prisma";
import { paginationHelpers } from "../../utils/pagination";
import { searchAbleFields } from "./admin.constant";

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

  andConditions.push({
    isDeleted: false,
  });

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

  // total data
  const total = await prisma.admin.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleDataFromDB = async (id: string): Promise<Admin> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new Error("Admin not found");
  }

  return result;
};

//* we cannot update foreign relational data in prisma. There are relation with email in user table. So we cannot update email.......
const updateDataInDB = async (id: string, payload: Partial<Admin>) => {
  const isExist = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExist) {
    throw new Error("Admin not found");
  }

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// there we are using transaction because we want to deleted admin data. if admin data deleted form admin then is also deleted from user table.

const deletedDataFromDB = async (id: string) => {
  // check if admin exist
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });
    return deletedAdmin;
  });
  return result;
};

const softDeletedDataFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleted = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: adminDeleted.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeleted;
  });
  return result;
};

export const adminService = {
  getAllAdminsFromDB,
  singleDataFromDB,
  updateDataInDB,
  deletedDataFromDB,
  softDeletedDataFromDB,
};
