import { z } from "zod";

export const classSchema = z.object({
  className: z.string().min(1, "Class name is required"),
});
