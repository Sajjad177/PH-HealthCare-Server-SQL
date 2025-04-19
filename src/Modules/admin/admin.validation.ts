import { z } from "zod";

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumbar: z.string().optional(),
    profilePhoto: z.string().optional(),
  }),
});

export const adminValidation = {
  update,
};