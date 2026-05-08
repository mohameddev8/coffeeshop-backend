import type { Request, Response } from "express";
import { AppError } from "./errorHandler.js";

export function notFoundHandler(req: Request, res: Response): void {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
}
