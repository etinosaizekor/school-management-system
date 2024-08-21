import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().pipe(z.coerce.date()),
  classId: z.number().min(1, "Class is required"),
  courseIds: z.array(z.number()),
});

