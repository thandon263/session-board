import Joi from "@hapi/joi"

export const registerValidation = data => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        mentor: Joi.boolean()
            .strict()
            .required(),
        mentee: Joi.boolean()
            .strict()
            .required(),
    })

    return schema.validate(data)
}

export const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    return schema.validate(data)
}

export const passwordUpdateValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    return schema.validate(data)
}

export const resetPasswordValidation = data => {
    const schema = Joi.object({
        code: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    return schema.validate(data)
}
