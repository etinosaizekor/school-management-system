import { Request, Response, NextFunction } from "express";

function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ReturnType<T> | void> => {
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (err) {
      console.log(err);

      next(err);
    }
  };
}

export default asyncHandler;