export default class TimeModel {
    constructor(db) {
        this.db = db
    }

    async createTime({time}) {
        return await this.db("times").insert(
            {
                time: time,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "time", "created_at"]
        )
    }

    async updateTime({id, time, isbookedValue}) {
        const updated = await this.db("times")
            .where({id})
            .update(
                {
                    time: time,
                    isbooked: isbookedValue,
                    updated_at: new Date().toUTCString(),
                },
                ["id", "time", "isbooked", "updated_at", "created_at"]
            )

        if (updated.length !== 1) {
            throw new Error(`Time with Id: ${id} was not found.`)
        }

        return updated[0]
    }

    async updateBooked({id, isbooked = false}) {
        const updated = await this.db("times")
            .where({id})
            .update(
                {
                    isbooked: isbooked,
                    updated_at: new Date().toUTCString(),
                },
                ["id", "time", "isbooked", "updated_at", "created_at"]
            )

        if (updated.length !== 1) {
            throw new Error(`Couldn't update booked for time with ID ${id}`)
        }

        return updated[0]
    }

    async findByTime({time, moment}) {
        const getTime = moment(time, "h:mm A").format("LT")

        const entries = await this.db("times")
            .select()
            .where({
                time: getTime,
            })

        if (entries.length === 0) {
            throw new Error(`Unable to find entry Time of ${time}`)
        }

        const entry = entries[0]
        return {
            id: entry.id,
            time: entry.time,
            isbooked: entry.isbooked,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
        }
    }

    async findTimeById({id}) {
        const entries = await this.db("times")
            .select()
            .where({
                id,
            })

        if (entries.length === 0) {
            throw new Error(`Unable to fnd entry Time of Id ${id}`)
        }

        const entry = entries[0]
        return {
            id: entry.id,
            time: entry.time,
            isbooked: entry.isbooked,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
        }
    }
}
