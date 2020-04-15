import Joi from "@hapi/joi"

export const dateValidation = data => {
    const schema = Joi.object({
        day: Joi.string().required(),
    })

    return schema.validate(data)
}
