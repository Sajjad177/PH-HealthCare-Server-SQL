import { PrismaClient, UserRole } from "../../generated/prisma";
import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";
import { sendImageToCloudinary } from "../../utils/imageUploader";

const createAdminInDB = async (payload: any, file: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  if (file) {
    const { secure_url } = await sendImageToCloudinary(
      file.filename,
      file.path
    );

    payload.admin.profilePhoto = secure_url as string;
  }

  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  //* In NOTE [user.txt]: 1 explain the transaction
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
