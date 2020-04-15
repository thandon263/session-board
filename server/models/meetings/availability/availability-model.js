export default class Availability {
    constructor(db) {
        this.db = db
    }

    async createAvailability({userId, day, time}) {
        return await this.db("availability").insert(
            {
                user_id: userId,
                day: day,
                time: time,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "user_id", "day", "time", "created_at"]
        )
    }

    async getAvailabilityInfo({userId, day}) {
        const entries = await this.db("availability")
            .select()
            .where({
                day: day,
                user_id: userId,
            })

        if (entries.length === 0) {
            throw new Error(`Unable to find entry Availability for ID: ${userId} and Day: ${day}`)
        }

        return entries
    }

    async getAvailabilityById({id}) {
        const entries = await this.db("availability")
            .select()
            .where({
                id: id,
            })

        if (entries.length === 0) {
            throw new Error(`Unable to find entry Availability ID: ${id}`)
        }

        return entries
    }

    async updateAvailabityPerDay({userId, availabilityId, time}) {
        const updated = await this.db("availability")
            .where({user_id: userId, id: availabilityId})
            .update(
                {
                    time: time,
                    updated_at: new Date().toUTCString(),
                },
                ["id", "time", "day", "user_id", "updated_at", "created_at"]
            )

        if (updated.length !== 1) {
            throw new Error(`User with Id: ${userId} for ${day} was not found.`)
        }

        return updated[0]
    }
}
