import Joi from "@hapi/joi"

export const milestonesValidation = data => {
    const schema = Joi.object({
        milestone: Joi.array().required(),
    })

    return schema.validate(data)
}
