import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../config/database.js";
import { env } from "../../config/env.js";
import { AppError } from "../../middlewares/errorHandler.js";
import type { RegisterInput, LoginInput, UserPayload, JwtPayload, UserRow } from "./auth.types.js";

const saltRounds = 12;

function generateToken(payload: JwtPayload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
}

function sanitize(user: UserRow): UserPayload {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}

export async function registerUser(
    input: RegisterInput
): Promise<{ user: UserPayload; token: string }> {

    const existing = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [input.email]
    );

    if (existing.rows.length > 0) {
        throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, saltRounds);
    const result = await db.query<UserRow>(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [input.name, input.email, hashedPassword]
    );
    const user: UserRow | undefined = result.rows[0];
    if (!user) {
        throw new AppError("Something went wrong during registration", 500);
    }
    const token = generateToken({userId: user.id, role: user.role});

    return {user: sanitize(user), token};
}
export async function loginUser(
    input: LoginInput
): Promise<{ user: UserPayload; token: string }> {

    const result = await db.query<UserRow>(
        "SELECT * FROM users WHERE email = $1",
        [input.email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: sanitize(user), token };
}
