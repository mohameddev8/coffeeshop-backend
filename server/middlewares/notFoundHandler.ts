import type {Request, Response, NextFunction} from "express";

import {AppError} from "./errorHandler.js";

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
}
