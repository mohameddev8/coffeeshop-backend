import vine from "@vinejs/vine";

export const createOrderValidator = vine.compile(
    vine.object({
        items: vine.array(
            vine.object({
                menu_item_id: vine.number().withoutDecimals(),
                quantity: vine.number().withoutDecimals().min(1),
            })
        ).minLength(1),
    })
);

export const updateOrderStatusValidator = vine.compile(
    vine.object({
        status: vine.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as const),
    })
);