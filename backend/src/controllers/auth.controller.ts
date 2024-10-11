import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { LoginPayload } from "../sharedTypes";
import asyncHandler from "express-async-handler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginPayload;
  const result = await authService.login({ email, password });
  res.send(result);
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginPayload;
  const result = await authService.signup(req.body);
  res.send(result);
});
