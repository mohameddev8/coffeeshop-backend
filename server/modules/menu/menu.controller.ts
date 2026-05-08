import {type Request, type Response, type NextFunction} from "express";
import {AppError} from "../../middlewares/errorHandler.js";
import {createMenuItem, getAllMenuItems, deleteMenuItem, getMenuItem, updateMenuItem} from "./menu.service.js";
import {menuValidator, updateMenuValidator} from "./menu.validator.js";

export async function getMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = await getAllMenuItems();
        res.status(200).json({
            status: "success",
            data: {items},
        });
    } catch (error) {
        next(error)
    }
}

export async function createMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await menuValidator.validate(req.body);
        const createdMenu = await createMenuItem(data);
        res.status(201).json({
            status: "success",
            data: {item: createdMenu}
        })
    } catch (error) {
        next(error)
    }
}

export async function updateMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id as string ?? "");
        if (isNaN(id)) {
            throw new AppError("Invalid category id", 400);
        }
        const data = await updateMenuValidator.validate(req.body);
        const updatedMenu = await updateMenuItem(id, data);
        res.status(200).json({
            status: "success",
            data: {item: updatedMenu}
        })
    } catch (error) {
        next(error)
    }
}

export async function getItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id as string ?? "");
        if (isNaN(id)) {
            throw new AppError("Invalid category id", 400);
        }
        const item = await getMenuItem(id);
        res.status(200).json({
            status: "success",
            data: {item}
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
          throw new AppError("Invalid id", 400);
        }
        await deleteMenuItem(id);
        res.status(200).json({
            status: "success",
            message: "Item deleted successfully",
        })
    } catch (error) {
        next(error)
    }
}
