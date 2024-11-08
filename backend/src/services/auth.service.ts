import ApiError from "../helper/ApiError";
import { userService } from "./user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginPayload } from "../types/sharedTypes";
import { User } from "../database/models/user";

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class AuthenticationService {
  private jwtSecret: string;
  private jwtExpiry: string;

  constructor(jwtSecret: string = "", jwtExpiry: string = "1h") {
    this.jwtSecret = jwtSecret;
    this.jwtExpiry = jwtExpiry;
  }

  async login(loginData: LoginPayload) {
    const { email, password } = loginData;

    const result = await userService.find({ email });

    if (result?.items.length === 0) {
      throw new ApiError(401, "Invalid credentials");
    }
    const user = result?.items[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new ApiError(401, "Invalid credentials");
    }
    const token = this.generateToken(user.id);

    return { user, token };
  }

  async signup(signupData: SignupPayload) {
    const { firstName, lastName, email, password } = signupData;

    const existingUser = await userService.find({ email });

    if (existingUser?.items.length) {
      throw new ApiError(400, "Email already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = (await userService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })) as User;

    const token = this.generateToken(newUser?.id);

    return { user: newUser, token };
  }
  private generateToken(userId: number) {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiry,
    });
  }
}

export const authService = new AuthenticationService(process.env.JWT_SECRET);
