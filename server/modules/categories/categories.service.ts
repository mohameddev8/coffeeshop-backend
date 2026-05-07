import { db } from "../../config/database.js";
import { AppError } from "../../middlewares/errorHandler.js";
import type {CreateCategoryInput, UpdateCategoryInput, CategoryRow} from "./categories.types.js";

export async function getAllCategories():Promise<CategoryRow[]>{
    const result = await db.query<CategoryRow>("SELECT * FROM categories ORDER BY created_at DESC");
    return(result.rows);
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryRow> {
    const existing = await db.query(
        "SELECT name FROM categories WHERE name = $1",
        [input.name]
    )
    if(existing.rows.length > 0){
        throw new AppError("Category with this name already exist",409);
    }
    const result = await db.query<CategoryRow>(
        `INSERT INTO categories (name, description)
        VALUES ($1,$2)
        RETURNING *`,[input.name,input.description]
    )
    const category = result.rows[0];
    if (!category) {
        throw new AppError("Failed to create category", 500);
    }
    return category;
}

export async function updateCategory(id: number, input: UpdateCategoryInput): Promise<CategoryRow> {
    const existing = await db.query<CategoryRow>(
        "SELECT * FROM categories WHERE id = $1",
        [id]
    );

    if (existing.rows.length === 0) {
        throw new AppError("Category not found", 404);
    }

    const old = existing.rows[0]!;

    const updated = await db.query<CategoryRow>(
        `UPDATE categories 
     SET name = $1, description = $2, updated_at = NOW()
     WHERE id = $3 
     RETURNING *`,
        [input.name ?? old.name, input.description ?? old.description, id]
    );

    return updated.rows[0]!;
}

export async function deleteCategory(id: number): Promise<void> {
    const result = await db.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
    );
    if(result.rows.length === 0){
        throw new AppError("Category not found", 404);
    }
}