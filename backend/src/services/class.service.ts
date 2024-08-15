import { BaseService } from "./baseService";
import db from '../database/models'

export const classService = new BaseService(db.class);
