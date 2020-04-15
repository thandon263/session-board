import Joi from "@hapi/joi"

export const timeValidation = data => {
    const schema = Joi.object({
        time: Joi.string().required(),
    })

    return schema.validate(data)
}
