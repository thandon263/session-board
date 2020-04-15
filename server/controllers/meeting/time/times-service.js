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
import TimeModel from "../../../models/meetings/time/times-model"

// Check User Authentication
import {checkAuth} from "../../../middleware/authenticationStatus"

// Initialize class
const Time = new TimeModel(database)

import {timeValidation} from "../../../validations/time-validations"

router.post("/", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = timeValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const localTime = moment(req.body.time, "h:mm A").format("LT")

        // create the request to save data
        const saveTime = await Time.createTime({time: localTime})

        return res.status(200).json({
            status: 200,
            message: "Successfully created time.",
            time: saveTime,
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
        const {error} = timeValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // get time from the req body
        const getTime = await Time.findByTime({time: req.body.time, moment})

        return res.status(200).json({
            status: 200,
            message: "Successfully retrieved the time.",
            time: getTime,
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

// Create update route when needed for editing time.

export default router
