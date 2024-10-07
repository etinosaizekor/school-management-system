// services/authenticationService.ts
import { User } from "database/models/user"; // Sequelize model
import { ModelStatic } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "helper/ApiError";

// Interface for signup and login payloads
interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export class AuthenticationService {
  protected model: ModelStatic<User>;
  private jwtSecret: string;
  private jwtExpiry: string;

  constructor(
    model: ModelStatic<User>,
    jwtSecret: string,
    jwtExpiry: string = "1h"
  ) {
    this.model = model;
    this.jwtSecret = jwtSecret;
    this.jwtExpiry = jwtExpiry;
  }

  // Signup method
  async signup(signupData: SignupPayload) {
    const { firstName, lastName, email, password } = signupData;

    // Check if user already exists
    const existingUser = await this.model.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, "Email already in use.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await this.model.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Issue a JWT token
    const token = this.generateToken(newUser.id);

    return { user: newUser, token };
  }

  // Login method
  async login(loginData: LoginPayload) {
    const { email, password } = loginData;

    const user = await this.model.findOne({ where: { email } });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Issue a JWT token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  // Helper function to generate JWT
  private generateToken(userId: number) {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiry,
    });
  }

  // Logout method
  logout() {
    return { message: "Logged out successfully." };
  }
}
