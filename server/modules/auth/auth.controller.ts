import { type Request, type Response, type NextFunction } from "express";
import { registerValidator, loginValidator } from "./auth.validation.js";
import { registerUser, loginUser } from "./auth.service.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await registerValidator.validate(req.body);
        const result = await registerUser(data);

        res.status(201).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await loginValidator.validate(req.body);
        const result = await loginUser(data);

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMe(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.status(200).json({
            status: "success",
            data: { user: req.user },
        });
    } catch (error) {
        next(error);
    }
}