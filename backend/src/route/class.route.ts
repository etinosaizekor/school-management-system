import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/class.controller";
import express from "express";

const router = express.Router();

router.post("/class.controllers", createClass);
router.get("/class.controllers", getClasses);

router.get("/class.controllers/:id", getClassById);
router.patch("/class.controllers", updateClass);
router.delete("/class.controllers", deleteClass);

export default router;
