export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItemRow {
    id: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
    created_at: Date;
}

export interface OrderRow {
    id: number;
    user_id: string;
    status: OrderStatus;
    total: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateOrderItemInput {
    menu_item_id: number;
    quantity: number;
}

export interface CreateOrderInput {
    items: CreateOrderItemInput[];
}

export interface UpdateOrderStatusInput {
    status: OrderStatus;
}