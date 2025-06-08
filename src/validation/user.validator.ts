import { z } from "zod/v4";

export const UserValidator = z.object({
  userId: z.number().optional(),
  email: z.email().trim(),
  fullName: z.string().min(5).max(100).trim(),
  password: z.string().min(4).max(100).trim(),
  userType: z.enum(["admin", "member"]).default("member"),
  otp: z.number().optional(),
});

export const UserLoginValidator = z.object({
  email: z.email().trim(),
  password: z.string().min(4).max(100).trim(),
});