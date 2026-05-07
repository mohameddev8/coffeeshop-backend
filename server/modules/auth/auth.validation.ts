import vine from "@vinejs/vine";

export const registerValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(2).maxLength(100),
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(64),
    })
);

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(1),
    })
);