import {db} from "../../config/database.js";
import {AppError} from "../../middlewares/errorHandler.js";
import type {OrderRow, OrderItemRow, CreateOrderInput, UpdateOrderStatusInput} from "./orders.types.js";

export async function createOrder(
    userId: string,
    input: CreateOrderInput
): Promise<OrderRow> {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // 1. Create the order
        const orderResult = await client.query<OrderRow>(
            `INSERT INTO orders (user_id)
             VALUES ($1)
             RETURNING *`,
            [userId]
        );
        const order = orderResult.rows[0]!;

        let total = 0;

        // 2. Insert each order item
        for (const item of input.items) {
            const menuItem = await client.query(
                "SELECT id, price, is_available FROM menu_items WHERE id = $1",
                [item.menu_item_id]
            );

            if (menuItem.rows.length === 0) {
                throw new AppError(`Menu item ${item.menu_item_id} not found`, 404);
            }

            const menuItemData = menuItem.rows[0];

            if (!menuItemData.is_available) {
                throw new AppError(`Menu item ${item.menu_item_id} is not available`, 400);
            }

            const itemPrice = menuItemData.price * item.quantity;
            total += itemPrice;

            await client.query(
                `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.menu_item_id, item.quantity, menuItemData.price]
            );
        }

        // 3. Update the total
        const updatedOrder = await client.query<OrderRow>(
            `UPDATE orders
             SET total = $1
             WHERE id = $2
             RETURNING *`,
            [total, order.id]
        );

        await client.query("COMMIT");

        return updatedOrder.rows[0]!;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function getMyOrders(userId: string): Promise<OrderRow[]> {
    const result = await db.query<OrderRow>(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return result.rows;
}

export async function getAllOrders(): Promise<OrderRow[]> {
    const result = await db.query<OrderRow>(
        "SELECT * FROM orders ORDER BY created_at DESC"
    );
    return result.rows;
}

export async function updateOrderStatus(
    id: number,
    input: UpdateOrderStatusInput
): Promise<OrderRow> {
    const result = await db.query<OrderRow>(
        `UPDATE orders
         SET status = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [input.status, id]
    );

    if (result.rows.length === 0) {
        throw new AppError("Order not found", 404);
    }

    return result.rows[0]!;
}