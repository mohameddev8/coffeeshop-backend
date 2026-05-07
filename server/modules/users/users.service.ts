import {db} from "../../config/database.js";
import {AppError} from "../../middlewares/errorHandler.js";
import type {UserPayload} from "../auth/auth.types.js";

export async function getAllUsers(): Promise<UserPayload[]> {
    const all = await db.query<UserPayload>("SELECT id, name, email, role FROM users");
    return (all.rows);
}

export async function getUserById(id: number): Promise<UserPayload> {
    const user = await db.query<UserPayload>(
        `SELECT id,
                name,
                email,
                role
         FROM users
         WHERE id = $1 `,
        [id]
    )
    if (user.rows.length === 0) {
        throw new AppError("No user found", 404)
    }
    return user.rows[0]!;

}