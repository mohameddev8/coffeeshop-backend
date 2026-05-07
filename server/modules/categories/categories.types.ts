export interface CreateCategoryInput {
    name: string;
    description: string;
}

export interface UpdateCategoryInput {
    name?: string;
    description?: string;
}

export interface CategoryRow {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}