import { BaseService } from "./baseService";
import db from "../database/models";
import { Student } from "../database/models/student";
import { CreationAttributes, ModelStatic } from "sequelize";
import { PageOptions, PaginatedResult } from "../types/sharedTypes";
import { Course } from "../database/models/course";
import ApiError from "../helper/ApiError";
import { Class } from "../database/models/class";

class StudentService extends BaseService<Student> {
  constructor(model: ModelStatic<Student>) {
    super(model);
  }

  async create(studentData: CreationAttributes<Student>): Promise<Student> {
    const { courseIds, classId, userId } = studentData;

    const student = await this.model.create(studentData);

    await student.addCourses(courseIds, { raw: true });
    await student.setClass(classId);

    return student;
  }

  async addCourses(studentId: string, courseIds: number[]): Promise<Course[]> {
    const student = await this.model.findByPk(studentId);

    if (!student) {
      throw new ApiError(404, `Student with ID ${studentId} not found`);
    }

    const courses = await Course.findAll({
      where: {
        id: courseIds,
      },
      raw: true,
    });

    const studentCourseIds = courses.map((course) => course.id);
    const newlyAddedCourse = await student.addCourses(studentCourseIds);

    const studentCourses = await student.getCourses();

    return studentCourses;
  }

  async removeCourses(
    studentId: string,
    courseIds: string[]
  ): Promise<Course[]> {
    const student = await this.model.findByPk(studentId);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    student.removeCourses(courseIds);
    const updatedCourses = await student.getCourses();

    return updatedCourses;
  }

  async findById(studentId: string): Promise<Student | null> {
    const student = await this.model.findByPk(studentId, {
      include: [
        {
          model: Course,
          attributes: ["id", "courseName", "courseCode", "credit"],
          through: { attributes: [] },
        },
        {
          model: Class,
          attributes: ["id", "className"],
        },
      ],
    });

    return student;
  }

  async find(
    criteria: Record<string, any> = {},
    options: PageOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult | null> {
    const { page, limit } = options;

    const startIndex = (page - 1) * limit;

    try {
      const results = await this.model.findAll({
        where: criteria,
        include: [
          {
            model: Course,
          },
          {
            model: Class,
          },
        ],
        offset: startIndex,
        limit: limit,
      });

      const totalDocumentCount = await this.model.count(criteria);
      const totalPages = Math.ceil(totalDocumentCount / limit);

      return {
        items: results,
        pagination: {
          totalPages: 0,
          currentPage: page,
          totalItems: 0,
          limit,
        },
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }
  async update(
    studentId: number | string,
    updatedData: Record<string, any>
  ): Promise<Student | null> {
    const { courseIds, classId } = updatedData;

    await this.model.update(updatedData, {
      where: { id: studentId },
    });

    const updatedStudent = await this.model.findByPk(studentId);

    if (updatedStudent) {
      await updatedStudent.setCourses(courseIds);
      await updatedStudent.setClass(classId);
    }

    const student = await this.model.findByPk(studentId, {
      include: [
        {
          model: Course,
        },
        {
          model: Class,
        },
      ],
    });

    return student;
  }
}

export const studentService = new StudentService(db.student);
