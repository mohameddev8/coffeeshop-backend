import {Router} from "express";
import {placeOrder, getMyOrdersController, getAllOrdersController, updateStatus} from "./orders.controller.js";
import {authenticate} from "../../middlewares/auth.middleware.js";
import {authorize} from "../../middlewares/role.middleware.js";

export const ordersRouter = Router();

ordersRouter.post("/", authenticate, authorize("customer"), placeOrder);
ordersRouter.get("/my-orders", authenticate, authorize("customer"), getMyOrdersController);
ordersRouter.get("/", authenticate, authorize("admin"), getAllOrdersController);
ordersRouter.put("/:id/status", authenticate, authorize("admin"), updateStatus);