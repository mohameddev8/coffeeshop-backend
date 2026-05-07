import {Router} from "express";
import {allUsers, getUser} from "./users.controller.js";
import {authenticate} from "../../middlewares/auth.middleware.js";
import {authorize} from "../../middlewares/role.middleware.js";

export const usersRouter = Router();

usersRouter.get("/", authenticate, authorize("admin"), allUsers)
usersRouter.get("/:id", authenticate, authorize("admin"), getUser)