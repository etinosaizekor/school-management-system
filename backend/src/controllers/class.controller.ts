import { Request, Response } from "express";
import { classService } from "../services/class.service";
import asyncHandler from "express-async-handler";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  const newClass = await classService.create(body);
  res.status(201).json(newClass);
});

export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const classes = await classService.find();
  res.status(200).json(classes);
});

export const getClassById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const classes = await classService.findById(id);
    res.status(200).json(classes);
  }
);

export const updateClass = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const updatedClass = await classService.update(id, body);
  res.status(200).json(updatedClass);
});

export const deleteClass = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const deletedClass = await classService.deleteOne(id);
  res.status(200).json(deletedClass);
});

export const addStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = req.body;

  const { classId } = req.params;

  const studentCourses = await classService.addStudents(classId, students);

  res.send(studentCourses);
});

export const removeStudentFromClass = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId } = req.params;
    const studentIds = req.body;
    const deletedClass = await classService.removeStudents(classId, studentIds);
    res.status(200).json(deletedClass);
  }
);
