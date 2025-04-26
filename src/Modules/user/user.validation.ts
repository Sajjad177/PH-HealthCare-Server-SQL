import { z } from "zod";
import { Gender } from "../../generated/prisma";

const createAdmin = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    admin: z.object({
      name: z.string({
        required_error: "Name is required",
      }),
      email: z.string({
        required_error: "Email is required",
      }),
      contactNumbar: z.string({
        required_error: "Contact number is required",
      }),
      profilePhoto: z.string().optional(),
    }),
  }),
});

const createDoctor = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    doctor: z.object({
      name: z.string({
        required_error: "Name is required",
      }),
      email: z.string({
        required_error: "Email is required",
      }),
      contactNumbar: z.string({
        required_error: "Contact number is required",
      }),
      profilePhoto: z.string().optional(),
      address: z.string().optional(),
      registrationNumber: z.string({
        required_error: "Registration number is required",
      }),
      experience: z.number().optional(),
      gender: z.enum([Gender.FEMALE, Gender.MALE]),
      appointFee: z.number({
        required_error: "Appointment fee is required",
      }),
      qualification: z.string({
        required_error: "Qualification is required",
      }),
      currentWoringPlace: z.string({
        required_error: "Please provide current working place",
      }),
      designation: z.string({
        required_error: "Designation is required",
      }),
    }),
  }),
});

const createPatient = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    patient: z.object({
      name: z.string({
        required_error: "Name is required",
      }),
      email: z.string({
        required_error: "Email is required",
      }),
      contactNumbar: z.string({
        required_error: "Contact number is required",
      }),
      age: z.number({
        required_error: "Age is required",
      }),
      profilePhoto: z.string().optional(),
      address: z.string().optional(),
      gender: z.enum([Gender.FEMALE, Gender.MALE]),
    }),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
};
