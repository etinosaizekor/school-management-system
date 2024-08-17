import express, { NextFunction, Request, Response } from "express";
import routes from "./route";
import dotenv from "dotenv";
import ApiError from "./helper/ApiError";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middleware/error";
import db from "./database/models";
dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorConverter);

app.use(errorHandler);

const port: string | undefined = process.env.PORT;

db.sequelize
  .sync({ alter: true }) // or { force: true } in development
  .then(() => {
    console.log("Database synchronized");
    // Start your server after synchronization
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

app.listen(port, () => console.log(`Express server running at ${port}`));
