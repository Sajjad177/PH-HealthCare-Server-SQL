import { PrismaClient, UserRole } from "../../generated/prisma";

const prisma = new PrismaClient();

const createAdminInDB = async (payload: any) => {
  const userData = {
    email: payload.admin.email,
    password: payload.password,
    role: UserRole.ADMIN,
  };

  //* In NOTE: 1 explain the transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    // Create a new user in the 'user' table
    await transactionClient.user.create({
      data: userData,
    });
    // Create a new admin in the 'admin' table
    const createAdminData = await transactionClient.admin.create({
      data: payload.admin,
    });
    return createAdminData;
  });

  return result;
};

export const userService = {
  createAdminInDB,
};
