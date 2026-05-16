import { Pool } from "pg";
import { env } from "./env.js";

export const db = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
})
export async function connectDatabase(): Promise<void> {
    try {
        const client = await db.connect();
        client.release();
        console.log("\x1b[32m●\x1b[0m [Database] PostgreSQL connected successfully");
    } catch (error) {
        console.error(`\x1b[31m●\x1b[0m [Database] Failed to connect to PostgreSQL: ${error}`);
        process.exit(1);
    }}
