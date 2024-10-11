import { login, signup } from "../controllers/auth.controller";
import express from "express";
import { validate } from "../middleware/validate";
import { loginSchema, signupSchema } from "../validations/auth.validation";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);

export default router;
