// server/middlewares/errorHandler.ts
import type {Request,Response, NextFunction } from "express";
import { env } from "../config/env";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            status: "error",
            message: error.message,
        });
        return;
    }
    console.error("[ERROR]", error);

    res.status(500).json({
        status: "error",
        message: env.isProduction
            ? "Something went wrong"
            : error.message,
    });
}