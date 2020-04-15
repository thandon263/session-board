import LocationModel from "./location/location-model"
import AvailabilityModel from "./availability/availability-model"
import GoalModel from "../goal/goal-model"
import ProfileModel from "../profile/profile-model"

export default class MeetingModel {
    constructor(db) {
        this.db = db
        this.location = new LocationModel(db)
        this.availability = new AvailabilityModel(db)
        this.goals = new GoalModel(db)
        this.profile = new ProfileModel(db)
    }

    async createMeeting({userId, locationId, availabilityId, goalId}) {
        return await this.db("meetings").insert(
            {
                user_id: userId,
                location_id: locationId,
                availability_id: availabilityId,
                goal_id: goalId,
                updated_at: new Date().toUTCString(),
                created_at: new Date().toUTCString(),
            },
            ["id", "user_id", "location_id", "availability_id", "goal_id", "created_at"]
        )
    }

    async getMeetingById({meetingId, userId, goalId}) {
        const entries = await this.db("meetings")
            .select()
            .where({
                id: meetingId,
                user_id: userId,
                goal_id: goalId,
            })

        if (entries.length === 0) {
            throw new Error(`Unable to find entry Meeting with ID: ${meetingId}.`)
        }

        const entry = entries[0]
        return {
            id: entry.id,
            meeting_id: entry.meeting_id,
            user_id: entry.user_id,
            availability_id: entry.availability_id,
            goal_id: entry.goal_id,
            updated_at: entry.updated_at,
            created_at: entry.created_at,
        }
    }
}
