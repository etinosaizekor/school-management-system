import express, { NextFunction, Request, Response } from "express";
import routes from "./route";
import dotenv from "dotenv";
import ApiError from "./helper/ApiError";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middleware/error";
dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorConverter);

app.use(errorHandler);

const port: string | undefined = process.env.PORT;

app.listen(port, () => console.log(`Express server running at ${port}`));
