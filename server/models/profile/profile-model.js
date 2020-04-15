import UserModel from "../authentication/user-model"

export default class Profile extends UserModel {
    constructor(db) {
        super(db)
        this.db = db
    }

    async create({email, job_title, bio, image_url, people_managed}) {
        const user = await super.find(email)

        return this.db("profiles").insert(
            {
                user_id: user.id,
                job_title: job_title,
                bio: bio,
                image_url: image_url,
                people_managed: people_managed,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "user_id", "job_title", "image_url", "bio", "created_at", "updated_at"]
        )
    }

    async findById(id) {
        const entries = await this.db("profiles")
            .select()
            .where({user_id: id})

        if (entries.length === 0) {
            throw new Error("Unable to find entry profile by id.")
        }

        const entry = entries[0]
        return {
            profile_id: entry.id,
            user_id: entry.user_id,
            job_title: entry.job_title,
            image_url: entry.image_url,
            bio: entry.bio,
            people_managed: entry.people_managed,
            skype_id: entry.skype_id,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
        }
    }

    async findSkypeId(id) {
        const entries = await this.db("profiles")
            .select()
            .where({user_id: id})

        if (entries.length === 0) {
            throw new Error("Unable to find entry profile by id.")
        }

        const entry = entries[0]
        return {
            profile_id: entry.id,
            user_id: entry.user_id,
            skype_id: entry.skype_id,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
        }
    }

    async findNamesByEmail(email) {
        const user = await super.find(email)
        const entries = await this.db("profiles")
            .select()
            .where({user_id: user.id})

        if (entries.length === 0) {
            throw new Error("Unable to find entry profile by id.")
        }

        const entry = entries[0]
        return {
            profile_id: entry.id,
            user_id: entry.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
        }
    }

    async updatePeopleAndJob(userId, jobTitle, peopleManaged) {
        const updated = await this.db("profiles")
            .where({
                user_id: userId,
            })
            .update(
                {
                    job_title: jobTitle,
                    people_managed: peopleManaged,
                    updated_at: new Date().toUTCString(),
                },
                ["user_id", "job_title", "people_managed", "updated_at"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update People Managed.")
        }

        return updated[0]
    }

    async updateSkypeId(userId, skypeId) {
        const updated = await this.db("profiles")
            .where({
                user_id: userId,
            })
            .update(
                {
                    skype_id: skypeId,
                    updated_at: new Date().toUTCString(),
                },
                ["user_id", "skype_id", "updated_at"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update Skype Id.")
        }

        return updated[0]
    }

    async updateProfileBio(userId, bio) {
        console.log("User ID Information: ", {backgroundColor: "green", color: "lightGreen"}, userId)
        const updated = await this.db("profiles")
            .where({
                user_id: userId,
            })
            .update(
                {
                    bio: bio,
                    updated_at: new Date().toUTCString(),
                },
                ["user_id", "bio", "updated_at"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update Profile Bio.")
        }

        return updated[0]
    }

    async updateProfileImage(userId, imageUrl) {
        const updated = await this.db("profiles")
            .where({
                user_id: userId,
            })
            .update(
                {
                    image_url: imageUrl,
                    updated_at: new Date().toUTCString(),
                },
                ["user_id", "image_url", "updated_at"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update the Profile Image.")
        }

        return updated[0]
    }
}
