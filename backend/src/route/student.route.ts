import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    addCourses,
  } from "../controllers/student.controller";
  import express from "express";
import { validate } from "../middleware/validate";
import { createStudentSchema, updateStudentSchema } from "../validations/student.validation";
  
  const router = express.Router();
  
  router.post("/students", validate(createStudentSchema), createStudent);
  router.post("/students/:studentId/courses", addCourses);
  router.get("/students", getStudents);
  router.get("/students/:id", getStudentById);
  router.patch("/students", validate(updateStudentSchema), updateStudent);
  router.delete("/students", deleteStudent);
  
  export default router;
  