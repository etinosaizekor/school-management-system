import express, { NextFunction, Request, Response } from "express";
import routes from "./route";
import dotenv from "dotenv";
import ApiError from "./helper/ApiError";
import httpStatus from "http-status";
import { errorFormatter, errorHandler } from "./middleware/error";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // frontend domain
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not found"));
});

app.use(errorFormatter);
app.use(errorHandler);

export default app;
