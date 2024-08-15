import { BaseService } from "./baseService";
import db from '../database/models'

export const studentService = new BaseService(db.student);
