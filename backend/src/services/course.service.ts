import { BaseService } from "./baseService";
import db from '../database/models'

export const courseService = new BaseService(db.course);
