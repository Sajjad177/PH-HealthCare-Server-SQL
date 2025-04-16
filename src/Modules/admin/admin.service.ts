import { Prisma, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any) => {
  const { searchTerm, ...filterData } = params;

  // const searchTerm = params?.searchTerm || "";
  const andConditions: Prisma.AdminWhereInput[] = [];
  const searchAbleFields = ["name", "email"];

  // if searchTerm then show searchTerm data else show all data
  if (searchTerm) {
    andConditions.push({
      // Search by name or email contains
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // if filterData then show filterData data
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
    orderBy: {
      createdAt: "desc", // Optional: order newest first
    },
  });

  return result;
};

export const adminService = {
  getAllAdminsFromDB,
};
