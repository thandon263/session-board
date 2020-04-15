import Profile from "../../profile/profile-model"

export default class LocationModel extends Profile {
    constructor(db) {
        super(db)
        this.db = db
    }

    async createNewLocation({userId, name, location}) {
        return await this.db("location").insert(
            {
                user_id: userId,
                name: name,
                location: location,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "user_id", "name", "location", "created_at"]
        )
    }

    async getLocationInfo({userId}) {
        const entries = await this.db("location")
            .select()
            .where(
                {
                    user_id: userId,
                },
                ["id", "user_id", "name", "location", "created_at", "updated_at"]
            )

        if (entries.length === 0) {
            throw new Error(`Unable to find entry Availability for ID: ${userId}`)
        }

        return entries
    }

    async updateLocation({id, userId, name, location}) {
        const updated = await this.db("location")
            .where({
                id: id,
                user_id: userId,
            })
            .update(
                {
                    location: location,
                    name: name,
                    updated_at: new Date().toUTCString(),
                },
                ["id", "user_id", "name", "location", "updated_at"]
            )

        if (updated.length !== 1) {
            throw new Error(`Unable to update the entry with id ${id}.`)
        }

        return updated[0]
    }
}
