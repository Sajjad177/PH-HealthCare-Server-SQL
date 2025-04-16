import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any) => {
  const searchTerm = params?.searchTerm || "";

  const result = await prisma.admin.findMany({
    where: {
      // Search by name or email
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive", // for case-insensitive search
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive", 
          },
        },
      ],
    },
  });

  return result;
};

export const adminService = {
  getAllAdminsFromDB,
};
