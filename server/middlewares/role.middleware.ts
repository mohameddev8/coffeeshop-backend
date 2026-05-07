import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "./errorHandler.js";

export function authorize(...roles: Array<"customer" | "admin">) {
    return function (req: Request, res: Response, next: NextFunction): void {
        if (!req.user) {
            next(new AppError("Not authenticated", 401));
            return;
        }

        if (!roles.includes(req.user.role)) {
            next(new AppError("You do not have permission", 403));
            return;
        }

        next();
    };
}