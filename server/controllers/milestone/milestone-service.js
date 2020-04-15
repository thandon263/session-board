import {Router} from "express"
import jwt from "jsonwebtoken"
import moment from "moment"
import _ from "lodash"

// Setup the environment
const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../knexfile")[environment]
// Database
const database = require("knex")(configuration)

// Import the milestone
import MilestoneModel from "../../models/milestones/milestone-model"

// Initialize this goal class
const Milestone = new MilestoneModel(database)

const router = Router()

// Check User Authentication
import {checkAuth} from "../../middleware/authenticationStatus"
import {async} from "regenerator-runtime"

import {milestonesValidation} from "../../validations/milestone-validations"

router.post("/create", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = milestonesValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decode = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        // Data from front end
        const data = {type: req.body.milestone}
        // Deadline for the next
        const timeline = moment().add(90, "days")

        // Create a new milestone
        const createdMilestone = Milestone.createMilestone({
            userId: userId,
            goalId: userId,
            milestone: [data.type[0], data.type[1], data.type[2]],
            status: true,
            deadline: timeline,
        })

        // response
        return res.status(200).json({
            status: 200,
            message: "Successfully created the milestone.",
            milestone: createdMilestone,
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

router.get("/", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = milestonesValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        // User Id
        const userId = Decoded.user.id

        // return the milestone information
        const milestones = Milestone.getAllMilestoneInfo(userId)

        return res.status(200).json({
            status: 200,
            message: "Successfully retrieved all results.",
            milestone: milestones,
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

router.put("/", checkAuth, async (req, res, next) => {})

export default router
