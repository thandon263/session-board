import Joi from "@hapi/joi"

export const goalTitleValidation = data => {
    const schema = Joi.object({
        goal_title: Joi.string()
            .min(1)
            .required(),
    })

    return schema.validate(data)
}

export const goalTypeValidation = data => {
    const schema = Joi.object({
        goal_type: Joi.number().required(),
    })

    return schema.validate(data)
}

export const mentorshipTypeValidation = data => {
    const schema = Joi.object({
        mentorship_type: Joi.array().required(),
    })

    return schema.validate(data)
}

export const expertiseTypeValidation = data => {
    const schema = Joi.object({
        expertise: Joi.number().required(),
    })

    return schema.validate(data)
}
