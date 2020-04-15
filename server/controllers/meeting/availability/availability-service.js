import {Router} from "express"
import jwt from "jsonwebtoken"
import moment from "moment"

// Setup the environment
const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../../knexfile")[environment]
// Database
const database = require("knex")(configuration)

const router = Router()

// Import models
import Availability from "../../../models/meetings/availability/availability-model"

// Check User Authentication
import {checkAuth} from "../../../middleware/authenticationStatus"

// Initialize class (Date may class with the static Date() class)
const AvailabilityModel = new Availability(database)

// Get validation import
import {
    CreateAvailabilityValidation,
    UpdateAvailabilityValidation,
    GetAvailabilityValidation,
} from "../../../validations/availability-validation"

router.post("/create", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = CreateAvailabilityValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        // Standardize Time
        const updatedTime = moment(req.body.time, "h:mm A").format("LT") // - eg: 10:30 PM
        const updatedDate = moment(req.body.day).format("MM/DD/YYYY") // - eg: 03/25/2020

        // Create your availability
        const newAvailableTime = await AvailabilityModel.createAvailability({
            userId: userId,
            day: updatedDate,
            time: updatedTime,
        })

        return res.status(200).json({
            status: 200,
            message: "Successfully added available date.",
            availability: newAvailableTime,
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

router.get("/info", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = GetAvailabilityValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        // Format Date
        const updatedDate = moment(req.body.day).format("MM/DD/YYYY")

        // Get Availability Information
        const getAvailability = await AvailabilityModel.getAvailabilityInfo({userId: userId, day: updatedDate})

        return res.status(200).json({
            status: 200,
            message: `Successfully retrieved all available times for ${Decoded.user.first_name}`,
            availability: getAvailability,
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

router.put("/update-time", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = UpdateAvailabilityValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        // Updated Time
        const updatedTime = moment(req.body.time, "h:mm A").format("LT") // - eg: 10:30 PM

        // Update the time for Availability
        const updateAvailability = await AvailabilityModel.updateAvailabityPerDay({
            userId: userId,
            availabilityId: req.body.availabilityId,
            time: updatedTime,
        })

        return res.status(200).json({
            status: 200,
            message: "Successfully updated the time",
            availability: updateAvailability,
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
