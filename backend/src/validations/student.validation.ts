import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  age: z.number(),
  class: z.string().min(1, "Class is required")
});

export const updateStudentSchema = createStudentSchema.partial()