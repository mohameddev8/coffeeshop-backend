import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getMe);