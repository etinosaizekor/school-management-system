import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addCourses,
  removeCourses,
} from "../controllers/student.controller";
import express from "express";
import { validate } from "../middleware/validate";
import { studentSchema } from "../validations/student.validation";
import { authenticateJWT } from "../middleware/jwtMiddleware";

const router = express.Router();
router.use(authenticateJWT)

router.post("/students", validate(studentSchema), createStudent);
router.post("/students/:studentId/courses", addCourses);
router.get("/students", getStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", validate(studentSchema), updateStudent);
router.delete("/students/:studentId/courses", removeCourses);
router.delete("/students/:id", deleteStudent);

export default router;
