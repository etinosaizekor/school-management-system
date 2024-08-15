import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
  } from "../controllers/student.controller";
  import express from "express";
  
  const router = express.Router();
  
  router.post("/student.controllers", createStudent);
  router.get("/student.controllers", getStudents);
  
  router.get("/student.controllers/:id", getStudentById);
  router.patch("/student.controllers", updateStudent);
  router.delete("/student.controllers", deleteStudent);
  
  export default router;
  