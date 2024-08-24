import express, { NextFunction, Request, Response } from "express";
import routes from "./route";
import dotenv from "dotenv";
import ApiError from "./helper/ApiError";
import httpStatus from "http-status";
import { errorFormatter, errorHandler } from "./middleware/error";
import db from "./database/models";
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

app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not found"));
});

app.use(errorFormatter);
app.use(errorHandler);

const port: string | undefined = process.env.PORT;

//Allow all for flexibility only
//Typically specify endpoint

db.sequelize
  // .sync({ alter: true }) // or { force: true } in development
  .then(() => {
    console.log("Database synchronized");
    // Start your server after synchronization
    app.listen(port, () => console.log(`Express server running at ${port}`));
  })
  .catch((err: any) => {
    console.error("Error synchronizing database:", err);
  });
