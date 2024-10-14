import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "../helper/ApiError";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.Authorization; // Get the token from cookies
  console.log(token);

  if (!token) {
    return next(new ApiError(403, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
