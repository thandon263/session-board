import TimeModel from "../time/times-model"

export default class DateModel extends TimeModel {
    constructor(db) {
        this.db = db
        this.time = new TimeModel(db)
    }

    async createMeetingDate({day, time, moment}) {
        const {id} = await this.time.findByTime({time: time, moment})

        // Update isBooked to true (To disable time)
        await this.time.updateBooked({id, isbooked: true})

        return await this.db("date").insert(
            {
                day: day,
                time_id: id,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "day", "time_id", "created_at", "updated_at"]
        )
    }
}

// Figure out a way to create Unique dates for each Mentor -
// Add as many ID's to the Availability table - for each time allocated.
// Once a User is free again - update the Availability table with UserId and set Time to [{ isBooked: false }]
// Meeting is updated by the Mentee - Who get info from the Availability table and then sets Location for each
// meeting place.
// Table with Location for ID - This table will contain 2 locations and Skype or (Virtual meeting ID)
