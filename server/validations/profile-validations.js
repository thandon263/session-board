import Joi from "@hapi/joi"

export const profileValidation = data => {
    const schema = Joi.object({
        job_title: Joi.string(),
        bio: Joi.string(),
        image_url: Joi.string(),
        people_managed: Joi.number().required(),
    })

    return schema.validate(data)
}

export const profileNamesValidation = data => {
    const schema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
    })

    return schema.validate(data)
}

export const profilePeopleManagedValidation = data => {
    const schema = Joi.object({
        job_title: Joi.string(),
        people_managed: Joi.number().required(),
    })

    return schema.validate(data)
}

export const profileEmailValidation = data => {
    const schema = Joi.object({
        email: Joi.string(),
    })

    return schema.validate(data)
}

export const profilePasswordValidation = data => {
    const schema = Joi.object({
        password: Joi.string(),
    })

    return schema.validate(data)
}

export const profileImageUrlValidation = data => {
    const schema = Joi.object({
        image_url: Joi.string(),
    })

    return schema.validate(data)
}

export const profileBioValidation = data => {
    const schema = Joi.object({
        bio: Joi.string(),
    })

    return schema.validate(data)
}
