import {type Request, type Response, type NextFunction} from "express";
import {AppError} from "../../middlewares/errorHandler.js";
import {getAllUsers, getUserById} from "./users.service.js";


export async function allUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users = await getAllUsers();
        res.status(200).json({
            status: "success",
            data: {users}
        });
    } catch (error) {
        next(error);
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id) || id <= 0) {
          throw new AppError("Invalid id", 400);
        }
        const user = await getUserById(id);
        res.status(200).json({
            status: "success",
            data: {user}
        })
    } catch (error) {
        next(error);
    }
}
