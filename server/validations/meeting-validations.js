import Joi from "@hapi/joi"

export const CreateMeetingValidation = data => {
    const schema = Joi.object({
        locationId: Joi.number().required(),
        availabilityId: Joi.number().required(),
    })

    return schema.validate(data)
}

export const GetMeetingValidation = data => {
    const schema = Joi.object({
        meetingId: Joi.number().required(),
    })

    return schema.validate(data)
}
