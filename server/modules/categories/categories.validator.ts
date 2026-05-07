import vine from "@vinejs/vine";

export const categoriesValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(20),
        description: vine.string().minLength(20).maxLength(100),
    })
);

export const updateCategoryValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(20).optional(),
        description: vine.string().minLength(20).maxLength(100).optional(),
    })
);