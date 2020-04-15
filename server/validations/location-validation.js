import Joi from "@hapi/joi"

export const newLocationValidation = data => {
    const schema = Joi.object({
        name: Joi.string(),
        location: Joi.object(),
        skypeId: Joi.string(),
    })

    return schema.validate(data)
}

export const updateLocationValidation = data => {
    const schema = Joi.object({
        locationId: Joi.number(),
        name: Joi.string(),
        location: Joi.object(),
        skypeId: Joi.string(),
    })

    return schema.validate(data)
}
