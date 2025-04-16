import { Prisma, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any) => {
  const searchTerm = params?.searchTerm || "";
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
