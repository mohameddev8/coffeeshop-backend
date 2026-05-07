import vine from "@vinejs/vine";

export const menuValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(100),
        description: vine.string().minLength(20).maxLength(100),
        price: vine.number().min(0),
        type: vine.enum(["coffee", "bun", "other"] as const),
        is_available: vine.boolean(),
        category_id: vine.number().withoutDecimals()
    })
);

export const updateMenuValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(100).optional(),
        description: vine.string().minLength(20).maxLength(100).optional(),
        price: vine.number().optional(),
        type: vine.enum(["coffee", "bun", "other"] as const).optional(),
        is_available: vine.boolean().optional(),
        category_id: vine.number().withoutDecimals().optional()
    })
)