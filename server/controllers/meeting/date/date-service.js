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
import DateModel from "../../../models/meetings/dates/date-model"

// Check User Authentication
import {checkAuth} from "../../../middleware/authenticationStatus"

// Initialize class (Date may class with the static Date() class)
const DateObject = new DateModel(database)

// Get validation import
import {dateValidation} from "../../../validations/date-validation"

router.post("/create", checkAuth, async (req, res, next) => {
    // Validate User Data
    const {error} = dateValidation(req.body)
    if (error) return res.status(400).json({status: 400, error: error.details[0].message})

    // Create a date - provide time and day
    const date = await DateObject.createMeetingDate({day: req.body.day, time: req.body.time, moment})

    console.log("Date Information: ", date)
    // Get date results and extract time - Get time by Id
    const getTimeInfo = await DateObject.findTimeById({id: date.id})
})
