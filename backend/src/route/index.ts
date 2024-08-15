import express from "express";
import courseRoute from "./course.route";

const router = express.Router();

const routes = [courseRoute];

routes.forEach((route) => {
  router.use("/", route);
});

export default router;
