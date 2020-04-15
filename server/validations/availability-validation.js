import Joi from "@hapi/joi"

export const CreateAvailabilityValidation = data => {
    const schema = Joi.object({
        time: Joi.string().required(),
        day: Joi.string().required(),
    })

    return schema.validate(data)
}

export const UpdateAvailabilityValidation = data => {
    const schema = Joi.object({
        time: Joi.string().required(),
        availabilityId: Joi.number().required(),
    })

    return schema.validate(data)
}

export const GetAvailabilityValidation = data => {
    const schema = Joi.object({
        day: Joi.string().required(),
    })

    return schema.validate(data)
}
