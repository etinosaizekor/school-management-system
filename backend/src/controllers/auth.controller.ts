import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { LoginPayload } from "../types/sharedTypes";
import asyncHandler from "express-async-handler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginPayload;
  const result = await authService.login({ email, password });
  const maxAge = 1 * 60 * 60 * 1000;

  res.cookie("Authorization", result.token, {
    secure: false,
    maxAge,
    sameSite: "strict",
  });

  res.send(result.user);
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginPayload;
  const result = await authService.signup(req.body);
  res.send(result);
});
