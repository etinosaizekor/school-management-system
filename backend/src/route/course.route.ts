import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import express from "express";
import { courseSchema } from "../validations/course.validation";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/courses", validate(courseSchema), createCourse);
router.get("/courses", getCourses);

router.get("/courses/:id", getCourseById);
router.patch("/courses", validate(courseSchema), updateCourse);
router.delete("/courses", deleteCourse);

export default router;
