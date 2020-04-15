export default class Milestone {
    constructor(db) {
        this.db = db
    }

    async createMilestone({userId, goalId, milestone, status, deadline}) {
        return await this.db("milestones").insert(
            {
                user_id: userId,
                milestones: milestone,
                goal_id: goalId,
                status: status,
                deadline: deadline,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "user_id", "milestones", "goal_id", "status", "deadline", "created_at", "updated_at"]
        )
    }

    async getAllMilestoneInfo(goalId) {
        const entries = await this.db("milestones")
            .select()
            .where({
                goal_id: goalId,
            })

        if (entries.length === 0) {
            throw new Error("Unable to find milestone entry by goal id")
        }

        return entries
    }

    async updateMilestoneInfo(goalId, deadline, milestone) {
        const updated = await this.db("milestones")
            .where({
                goal_id: goalId,
                milestones: milestone,
                deadline: deadline,
                updated_at: new Date().toUTCString(),
            })
            .update({}, ["id", "goal_id", "milestones", "deadline", "status", "updated_at"])

        if (updated.length !== 1) {
            throw new Error("Failed to update milestone details.")
        }

        return updated[0]
    }
}
