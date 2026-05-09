import {type Request, type Response, type NextFunction} from "express";
import {AppError} from "../../middlewares/errorHandler.js";
import {createOrder, getAllOrders, getMyOrders, updateOrderStatus} from "./orders.service.js";
import {createOrderValidator, updateOrderStatusValidator} from "./orders.validator.js";

export async function placeOrder(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) throw new AppError("Not authenticated", 401);
        const data = await createOrderValidator.validate(req.body);
        const order = await createOrder(req.user.id, data);
        res.status(201).json({
            status: "success",
            data: {order},
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyOrdersController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) throw new AppError("Not authenticated", 401);
        const orders = await getMyOrders(req.user.id);
        res.status(200).json({
            status: "success",
            data: {orders},
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllOrdersController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const orders = await getAllOrders();
        res.status(200).json({
            status: "success",
            data: {orders},
        });
    } catch (error) {
        next(error);
    }
}

export async function updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id) || id <= 0) {
          throw new AppError("Invalid id", 400);
        }
        const data = await updateOrderStatusValidator.validate(req.body);
        const order = await updateOrderStatus(id, data);
        res.status(200).json({
            status: "success",
            data: {order},
        });
    } catch (error) {
        next(error);
    }
}
