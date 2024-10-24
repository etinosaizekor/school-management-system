import express from "express";
import courseRoute from "./course.route";
import classRoute from "./class.route";
import studentRoute from "./student.route";
import authRoute from "./auth.route";

const router = express.Router();

const routes = [courseRoute, classRoute, studentRoute];

routes.forEach((route) => {
  router.use("/", route);
});

export default router;
