import { User } from "../database/models/user";
import { BaseService } from "./baseService";
import { ModelStatic } from "sequelize";
import db from "../database/models";

class UserService extends BaseService<User> {}

export const userService = new UserService(db.user);
