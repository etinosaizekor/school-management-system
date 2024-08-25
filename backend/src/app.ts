import express, { NextFunction, Request, Response } from "express";
import routes from "./route";
import dotenv from "dotenv";
import ApiError from "./helper/ApiError";
import httpStatus from "http-status";
import { errorFormatter, errorHandler } from "./middleware/error";
dotenv.config();
import cors from "cors";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
  })
);

const delayMiddleware = (ms: any) => (req: any, res: any, next: any) => {
  setTimeout(() => next(), ms);
};
// app.use(delayMiddleware(2000)); // Delay of 2000 milliseconds (2 seconds)

app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not found"));
});

app.use(errorFormatter);
app.use(errorHandler);

export default app
