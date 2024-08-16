import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        console.log(err);

        return res.status(400).json({
          status: "fail",
          error: err.errors,
        });
      }
      next(err);
    }
  };
