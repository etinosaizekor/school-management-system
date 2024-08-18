import { z } from "zod";

export const courseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
});
