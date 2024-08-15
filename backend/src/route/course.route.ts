import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import express from "express";

const router = express.Router();

router.post("/courses", createCourse);
router.get("/courses", getCourses);

router.get("/courses/:id", getCourseById);
router.patch("/courses", updateCourse);
router.delete("/courses", deleteCourse);

export default router;
