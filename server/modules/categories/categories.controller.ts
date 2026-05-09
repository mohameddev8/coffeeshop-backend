import {type Request, type Response, type NextFunction} from "express";
import {createCategory, updateCategory, deleteCategory, getAllCategories} from "./categories.service.js";
import {categoriesValidator, updateCategoryValidator} from "./categories.validator.js";
import {AppError} from "../../middlewares/errorHandler.js";

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const categories = await getAllCategories();
        res.status(200).json({
            status: "success",
            data: {categories},
        });
    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await categoriesValidator.validate(req.body);
        const category = await createCategory(data);
        res.status(201).json({
            status: "success",
            data: {category},
        });
    } catch (error) {
        next(error);
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id) || id <= 0) {
            throw new AppError("Invalid category id", 400);
        }
        const data = await updateCategoryValidator.validate(req.body);
        const updatedCategory = await updateCategory(id, data);
        res.status(200).json({
            status: "success",
            data: {updatedCategory},
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteCat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id) || id <= 0) {
            throw new AppError("Invalid category id", 400);
        }
        await deleteCategory(id);
        res.status(200).json({
            status: "success",
            message: `Category ${id} deleted`,
        })
    } catch (error) {
        next(error);
    }
}
