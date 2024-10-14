import { BaseService } from "./baseService";
import db from "../database/models";
import { Class } from "../database/models/class";
import { CreationAttributes, Model, ModelStatic, Op } from "sequelize";
import { PageOptions, PaginatedResult } from "../types/sharedTypes";
import { Student } from "../database/models/student";
import ApiError from "../helper/ApiError";

class ClassService extends BaseService<Class> {
  constructor(model: ModelStatic<Class>) {
    super(model);
  }

  async create(classData: CreationAttributes<Class>): Promise<Class> {
    const { studentIds, className } = classData;

    const existingClass = await this.model.findOne({ where: { className } });
    if (existingClass) {
      throw new ApiError(409, `Class with name "${className}" already exists.`);
    }

    const newClass = await this.model.create(classData);

    if (studentIds) {
      await newClass.addStudents(studentIds, { raw: true });
    }

    return newClass;
  }

  async addStudents(classId: string, studentIds: number[]): Promise<Student[]> {
    const foundClass = await this.model.findByPk(classId);

    if (!foundClass) {
      throw new ApiError(404, `Class with ID ${classId} not found`);
    }

    const students = await Student.findAll({
      where: {
        id: studentIds,
      },
      raw: true,
    });

    const classStudentIds = students.map((student) => student.id);
    await foundClass.addStudents(classStudentIds, { raw: true });

    const classStudents = await foundClass.getStudents();

    return classStudents;
  }

  async removeStudents(
    classId: string,
    studentIds: string[]
  ): Promise<Student[]> {
    const foundClass = await this.model.findByPk(classId);

    if (!foundClass) {
      throw new ApiError(404, "Class not found");
    }

    foundClass.removeStudents(studentIds);
    const updatedStudents = await foundClass.getStudents();

    return updatedStudents;
  }

  async findById(classId: string): Promise<Class | null> {
    const foundClass = await this.model.findByPk(classId, {
      include: [
        {
          model: Student,
        },
      ],
    });

    return foundClass;
  }

  async find(
    criteria: Record<string, any> = {},
    options: PageOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult | null> {
    const { page, limit } = options;

    const startIndex = (page - 1) * limit;

    try {
      const results = await this.model.findAll({
        include: [
          {
            model: Student,
          },
        ],
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
    classId: number | string,
    updatedData: Record<string, any>
  ): Promise<Class | null> {
    const { className, studentIds } = updatedData;

    // Check if a class with the same name already exists, excluding the current class
    const duplicateClass = await this.model.findOne({
      where: { className, id: { [Op.ne]: classId } },
    });

    if (duplicateClass) {
      throw new ApiError(409, `Class with name "${className}" already exists.`);
    }

    await this.model.update(updatedData, {
      where: { id: classId },
    });

    const updatedClass = await this.model.findByPk(classId);

    // Update the students if studentIds are provided
    if (studentIds && updatedClass) {
      await updatedClass.setStudents(studentIds);
    }

    // Re-fetch to ensure students are included
    return await this.model.findByPk(classId, {
      include: [{ model: Student }],
    });
  }
}

export const classService = new ClassService(db.class);
