import { Request, Response } from "express";
import { courseService } from "../services/course.service";
import asyncHandler from "express-async-handler";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;

    const newCourse = await courseService.create(body);
    res.status(201).json(newCourse);
  }
);

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await courseService.find();
  res.status(200).json(courses);
});

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseService.findById(id);
    res.status(200).json(course);
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    const updatedCourse = await courseService.update(id, body);
    res.status(200).json(updatedCourse);
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    const deletedCourse = await courseService.deleteOne(id);
    res.status(200).json(deletedCourse);
  }
);
