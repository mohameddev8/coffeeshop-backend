import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./errorHandler.js";
import type { JwtPayload, UserPayload } from "../modules/auth/auth.types.js";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError("No token provided", 401);
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        req.user = {
              id: decoded.userId,
              role: decoded.role,
              name: decoded.name,
              email: decoded.email,
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }
        next(new AppError("Invalid or expired token", 401));
    }
}
