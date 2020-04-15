import UserModel from "../authentication/user-model"

export default class Goal extends UserModel {
    constructor(db) {
        super(db)
        this.db = db
    }

    async createGoal({
        email,
        goal_title,
        goal_type,
        user_status,
        deadLine_date,
        skills_pref,
        mentorship_pref,
        goal_expertise,
        date_achieved,
    }) {
        const user = await super.find(email)

        return await this.db("goals").insert(
            {
                title: goal_title,
                owner_id: user.id,
                goal_type: goal_type,
                status: user_status,
                deadline: deadLine_date,
                mentorship_preferences: mentorship_pref,
                skill_preferences: skills_pref,
                goal_expertise: goal_expertise,
                first_created: new Date().toUTCString(),
                last_modified: new Date().toUTCString(),
                date_achieved: date_achieved,
            },
            [
                "title",
                "owner_id",
                "status",
                "deadline",
                "mentorship_preferences",
                "skill_preferences",
                "goal_expertise",
                "first_created",
                "last_modified",
                "date_achieved",
            ]
        )
    }

    async findById(id) {
        const entries = await this.db("goals")
            .select()
            .where({owner_id: id})

        if (entries.length === 0) {
            throw new Error("Unable to find goal entry by id")
        }

        const entry = entries[0]
        return {
            id: entry.id,
            title: entry.title,
            owner_id: entry.owner_id,
            goal_type: entry.goal_type,
            status: entry.status,
            deadline: entry.deadline,
            mentorship_preferences: entry.mentorship_preferences,
            skill_preferences: entry.skill_preferences,
            goal_expertise: entry.goal_expertise,
            first_created: entry.first_created,
            last_modified: entry.last_modified,
            date_achieved: entry.date_achieved,
        }
    }

    async updateGoalTitle(userId, goalTitle) {
        const updated = await this.db("goals")
            .where({owner_id: userId})
            .update(
                {
                    title: goalTitle,
                    last_modified: new Date().toUTCString(),
                },
                ["id", "owner_id", "title", "last_modified"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update goal title.")
        }

        return updated[0]
    }

    async updateGoalType(userId, goalType) {
        const updated = await this.db("goals")
            .where({owner_id: userId})
            .update(
                {
                    goal_type: goalType,
                    last_modified: new Date().toUTCString(),
                },
                ["id", "owner_id", "goal_type", "last_modified"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update goal type.")
        }

        return updated[0]
    }

    async updateMentorshipType(userId, [type_1, type_2, type_3]) {
        const updated = await this.db("goals")
            .where({owner_id: userId})
            .update(
                {
                    mentorship_preferences: [type_1, type_2, type_3],
                    last_modified: new Date().toUTCString(),
                },
                ["id", "owner_id", "mentorship_preferences", "last_modified"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update mentorship preference.")
        }

        return updated[0]
    }

    async updateGoalExpertise(userId, expertise) {
        const updated = await this.db("goals")
            .where({owner_id: userId})
            .update(
                {
                    goal_expertise: expertise,
                    last_modified: new Date().toUTCString(),
                },
                ["id", "owner_id", "goal_expertise", "last_modified"]
            )

        if (updated.length !== 1) {
            throw new Error("Failed to update goal expertise.")
        }

        return updated[0]
    }
}
