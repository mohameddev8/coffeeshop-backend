import { config } from "dotenv";
config();

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Expected environment variable: ${key}`);
    }
    return value;
}
export const env = {
    // Settings
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: parseInt(process.env.PORT ?? "3000", 10),
    // Database Config
    DB_HOST: requireEnv("DB_HOST"),
    DB_PORT: parseInt(process.env.DB_PORT ?? "5432", 10),
    DB_USER: requireEnv("DB_USER"),
    DB_PASSWORD: requireEnv("DB_PASSWORD"),
    DB_NAME: requireEnv("DB_NAME"),
    // Auth Config
    JWT_SECRET: requireEnv("JWT_SECRET"),
    JWT_EXPIRES_IN:(process.env.JWT_EXPIRES_IN ?? "7d") as "7d",
    // Helpers
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
} as const;
