// express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Define the type of `user` based on your JWT payload
    }
  }
}
