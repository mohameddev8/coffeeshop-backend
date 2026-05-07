import {db} from "../../config/database.js";
import {AppError} from "../../middlewares/errorHandler.js";
import type {MenuItemRow, CreateMenuInput, UpdateMenuInput} from "./menu.types.js";

export async function createMenuItem(input: CreateMenuInput): Promise<MenuItemRow> {
    const existing = await db.query(
        `SELECT *
         FROM menu_items
         WHERE name = $1`,
        [input.name]);
    if (existing.rows.length > 0) {
        throw new AppError("Item with this name already exist", 409)
    }
    const category = await db.query(
        "SELECT id FROM categories WHERE id = $1",
        [input.category_id]
    );

    if (category.rows.length === 0) {
        throw new AppError("Category not found", 404);
    }
    const result = await db.query<MenuItemRow>(
        'INSERT INTO menu_items (name, description, price, type, is_available, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [input.name, input.description, input.price, input.type, input.is_available, input.category_id]
    )
    const item = result.rows[0];
    if (!item) {
        throw new AppError("Failed to add item", 500);
    }
    return item;
}

export async function getAllMenuItems(): Promise<MenuItemRow[]> {
    const items = await db.query<MenuItemRow>(
        `SELECT *
         FROM menu_items
         ORDER BY created_at DESC`,)
    return (items.rows);
}

export async function getMenuItem(id: number): Promise<MenuItemRow> {
    const data = await db.query<MenuItemRow>("SELECT * FROM menu_items WHERE id = $1", [id]);
    if (data.rows.length === 0) {
        throw new AppError("Item not found", 404);
    }
    return data.rows[0]!;

}

export async function updateMenuItem(id: number, input: UpdateMenuInput): Promise<MenuItemRow> {
    const data = await db.query<MenuItemRow>("SELECT * FROM menu_items WHERE id = $1", [id]);
    if (data.rows.length === 0) {
        throw new AppError("Item not found", 404);
    }
    const old = data.rows[0]!;
    const updated = await db.query<MenuItemRow>(
        `UPDATE menu_items
         SET name=$1,
             description=$2,
             price=$3,
             type=$4,
             is_available=$5,
             category_id=$6,
             updated_at=NOW()
         WHERE id = $7
         RETURNING *`,
        [
            input.name ?? old.name,
            input.description ?? old.description,
            input.price ?? old.price,
            input.type ?? old.type,
            input.is_available ?? old.is_available,
            input.category_id ?? old.category_id,
            id]
    )
    return updated.rows[0]!;
}

export async function deleteMenuItem(id: number): Promise<void> {
    const data = await db.query<MenuItemRow>(
        'DELETE FROM menu_items WHERE id = $1 RETURNING *',
        [id]
    )
    if (data.rows.length === 0) {
        throw new AppError("Item not found", 404);
    }
}