import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addStudents,
  removeStudents,
} from "../controllers/course.controller";
import express from "express";
import { courseSchema } from "../validations/course.validation";
import { validate } from "../middleware/validate";
import { authenticateJWT } from "../middleware/jwtMiddleware";

const router = express.Router();
router.use(authenticateJWT)

router.post("/courses", validate(courseSchema), createCourse);
router.get("/courses", getCourses);
router.post("/courses/:courseId/students", addStudents);

router.get("/courses/:id", getCourseById);
router.put("/courses/:id", validate(courseSchema), updateCourse);
router.delete("/courses/:id", deleteCourse);
router.delete("/courses/:courseId/students", removeStudents);

export default router;
