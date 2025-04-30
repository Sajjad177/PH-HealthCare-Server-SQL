import {
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
} from "../../generated/prisma";
import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";
import { sendImageToCloudinary } from "../../utils/imageUploader";
import { IPagenationOptions } from "../../interface/pagination";
import { paginationHelpers } from "../../utils/pagination";
import { searchAbleFields } from "../admin/admin.constant";
import { userSearchAbleFields } from "./user.constant";

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

const createDoctorInDB = async (payload: any, file: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  if (file) {
    const { secure_url } = await sendImageToCloudinary(
      file.filename,
      file.path
    );

    payload.doctor.profilePhoto = secure_url as string;
  }

  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  //* In NOTE [user.txt]: 1 explain the transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    // Create a new user in the 'user' table
    await transactionClient.user.create({
      data: userData,
    });
    // Create a new admin in the 'admin' table
    const createDoctor = await transactionClient.doctor.create({
      data: payload.doctor,
    });
    return createDoctor;
  });

  return result;
};

const createPatientInDB = async (payload: any, file: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  if (file) {
    const { secure_url } = await sendImageToCloudinary(
      file.filename,
      file.path
    );
    payload.patient.profilePhoto = secure_url as string;
  }

  const userData = {
    email: payload.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createPatient = await transactionClient.patient.create({
      data: payload.patient,
    });
    return createPatient;
  });
  return result;
};

const getAllUsersFromDB = async (params: any, option: IPagenationOptions) => {
  const { limit, page, sortBy, sortOrder, skip } = paginationHelpers(
    option as any
  );
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  //*1
  if (searchTerm) {
    andConditions.push({
      //*2
      OR: userSearchAbleFields.map((field) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const where: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
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
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      Patient: true,
    },
  });

  // total data
  const total = await prisma.user.count({
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

const updateStatusFromDB = async (
  id: string,
  payload: { status: UserStatus }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const getMyProfileFromDB = async (user: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }
  return { ...userInfo, ...profileInfo };
};

export const userService = {
  createAdminInDB,
  createDoctorInDB,
  createPatientInDB,
  getAllUsersFromDB,
  updateStatusFromDB,
  getMyProfileFromDB,
};
