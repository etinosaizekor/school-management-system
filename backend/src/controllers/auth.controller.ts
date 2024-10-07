// controllers/authenticationController.ts
import { Request, Response } from "express";
import { AuthenticationService } from "services/auth.service";
import { User } from "database/models/user";

const jwtSecret = "yourJWTSecret"; // You can use env variables in production
const authenticationService = new AuthenticationService(User, jwtSecret);

export class AuthenticationController {
  // Signup controller
  async signup(req: Request, res: Response) {
    try {
      const signupData = req.body;
      const { user, token } = await authenticationService.signup(signupData);

      // Set JWT in HttpOnly cookie
      AuthenticationController.setTokenCookie(res, token);

      return res
        .status(201)
        .json({ message: "User created successfully.", user });
    } catch (error) {
      // return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Login controller
  async login(req: Request, res: Response) {
    try {
      const loginData = req.body;
      const { user, token } = await authenticationService.login(loginData);

      // Set JWT in HttpOnly cookie
      AuthenticationController.setTokenCookie(res, token);

      return res.status(200).json({ message: "Login successful.", user });
    } catch (error) {
      // return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Logout controller
  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully." });
  }

  // Helper function to set JWT in HttpOnly cookie
  private static setTokenCookie(res: Response, token: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict" as const,
      maxAge: 60 * 60 * 1000, // 1 hour
    };
    res.cookie("token", token, cookieOptions);
  }
}
