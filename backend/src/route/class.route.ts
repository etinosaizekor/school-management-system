import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  removeStudentFromClass,
} from "../controllers/class.controller";
import express from "express";
import { validate } from "../middleware/validate";
import { classSchema } from "../validations/class.validation";

const router = express.Router();

router.post("/classes", validate(classSchema), createClass);
router.get("/classes", getClasses);

router.get("/classes/:id", getClassById);
router.patch("/classes/:classId/students", removeStudentFromClass);
router.patch("/classes", validate(classSchema), updateClass);
router.delete("/classes", deleteClass);


export default router;
