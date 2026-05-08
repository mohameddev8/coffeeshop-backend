export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface UserPayload {
    id: string;
    role: "customer" | "admin";
    name: string;
    email: string;
}

export interface JwtPayload {
    userId: string;
    role: "customer" | "admin";
    name: string;
    email: string;
}

export interface UserRow {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";
    created_at: Date;
    updated_at: Date;
}
