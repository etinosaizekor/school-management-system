import z from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(1, "Emaill is required"),
  password: z.string(),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().min(1, "Emaill is required"),
  password: z.string(),
});
