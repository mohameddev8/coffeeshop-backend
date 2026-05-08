import { Router } from "express";
import { getAll, create, update, deleteCat } from "./categories.controller.js";
import {authenticate} from "../../middlewares/auth.middleware.js";
import {authorize} from "../../middlewares/role.middleware.js";

export const categoryRouter = Router();

categoryRouter.get("/", getAll);
categoryRouter.post("/", authenticate, authorize("admin"), create);
categoryRouter.put("/:id", authenticate, authorize("admin"), update);
categoryRouter.delete("/:id", authenticate, authorize("admin"), deleteCat);
