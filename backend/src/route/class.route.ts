import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  removeStudentFromClass,
  addStudents,
} from "../controllers/class.controller";
import express from "express";
import { validate } from "../middleware/validate";
import { classSchema } from "../validations/class.validation";

const router = express.Router();

router.post("/classes", validate(classSchema), createClass);
router.post("/classes/:classId/students", addStudents);
router.get("/classes", getClasses);

router.get("/classes/:id", getClassById);
router.put("/classes/:id", validate(classSchema), updateClass);
router.delete("/classes/:classId/students", removeStudentFromClass);
router.delete("/classes", deleteClass);

export default router;
