import {Router} from "express";
import {getMenu, createMenu, updateMenu, getItem, deleteMenu} from "./menu.controller.js";
import {authenticate} from "../../middlewares/auth.middleware.js";
import {authorize} from "../../middlewares/role.middleware.js";

export const menuRouter = Router();

menuRouter.get("/", getMenu);
menuRouter.get("/:id", getItem);
menuRouter.post("/", authenticate, authorize("admin"), createMenu);
menuRouter.put("/;id", authenticate, authorize("admin"), updateMenu);
menuRouter.delete("/;id", authenticate, authorize("admin"), deleteMenu);
