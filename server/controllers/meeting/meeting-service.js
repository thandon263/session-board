require("dotenv").config()
import {Router} from "express"
import jwt from "jsonwebtoken"
import moment from "moment"

// Setup the environment
const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../knexfile")[environment]
// Database
const database = require("knex")(configuration)

const router = Router()

// Import models
import MeetingModel from "../../models/meetings/meetings-model"

// Check User Authentication
import {checkAuth} from "../../middleware/authenticationStatus"

// Initialize class (Date may class with the static Date() class)
const Meeting = new MeetingModel(database)

// Get validation import
import {CreateMeetingValidation, GetMeetingValidation} from "../../validations/meeting-validations"

router.post("/create-meeting", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = CreateMeetingValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode auth token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        // Create meeting
        const newMeeting = await Meeting.createMeeting({
            userId: userId,
            locationId: req.body.locationId,
            availabilityId: req.body.availabilityId,
            goalId: userId,
        })

        console.log("Meeting Information: ", newMeeting)

        // Get location information by Id
        const locationInfo = await Meeting.location.getLocationInfo({userId: userId})

        // Get Availability Information by Id
        const availabilityInfo = await Meeting.availability.getAvailabilityById({id: req.body.availabilityId})

        // Get Goal Information by Id
        const goalInformation = await Meeting.goals.findById(userId)

        // Sign the token and pass the meeting Id
        const newToken = jwt.sign(
            {
                _id: Decoded.user.id,
                user: Decoded.user,
                meeting: newMeeting,
                loginInfo: {...Decoded.loginInfo.last_login},
            },
            process.env.TOKEN_SECRET
        )

        // Return data to the front end
        return res
            .header("Authorization", newToken)
            .status(200)
            .json({
                status: 200,
                message: "Successfully saved meeting.",
                meetingInfo: {
                    meeting: newMeeting,
                    locationInfo: locationInfo,
                    availabilityInfo: availabilityInfo,
                    goalInfo: goalInformation,
                },
                auth_token: newToken,
            })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

router.get("/meeting-info", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = GetMeetingValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the auth Token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        console.log("Token Info decoded: ", Decoded)

        // Meeting Information
        const meetingInfo = await Meeting.getMeetingById({meetingId: req.body.meetingId, userId, goalId: userId})

        console.log("Information for meetings: ", meetingInfo)

        // Get location information by Id
        const locationInfo = await Meeting.location.getLocationInfo({userId: userId})

        console.log("After location - ", locationInfo)
        // Get Availability Information by Id
        const availabilityInfo = await Meeting.availability.getAvailabilityById({id: meetingInfo.availability_id})

        console.log("After Availability - ", availabilityInfo)
        // User information (Mentor)
        const mentorUserName = await Meeting.profile.findByUserId(availabilityInfo[0].user_id)

        console.log("This is past mentor name: ", mentorUserName)
        // Get Goal Information by Id
        const goalInformation = await Meeting.goals.findById(userId)

        // Get the Skype - Id
        const {skype_id} = await Meeting.location.findSkypeId(userId)

        return res.status(200).json({
            status: 200,
            message: `Successfully retrieved the meeting for ${Decoded.user.first_name}`,
            meetingInfo: {
                meeting: meetingInfo.id,
                userId: meetingInfo.user_id,
                locationInfo: locationInfo.map(data => {
                    return {
                        name: data.name,
                        location: data.location,
                        skypeInfo: skype_id,
                    }
                }),
                availabilityInfo: availabilityInfo.map(data => {
                    return {
                        mentorId: data.user_id,
                        mentorName: `${mentorUserName.first_name} ${mentorUserName.last_name}`,
                        day: data.day,
                        time: data.time,
                    }
                }),
                goalInformation: {
                    goal_id: goalInformation.id,
                    title: goalInformation.title,
                },
            },
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

export default router
