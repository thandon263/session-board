import {Router} from "express"
import jwt from "jsonwebtoken"
import moment from "moment"
import _ from "lodash"

// Setup the environment
const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../knexfile")[environment]
// Database
const database = require("knex")(configuration)

// Import the Goal class (Model)
import GoalModel from "../../models/goal/goal-model"

// Initialize this goal class
const Goal = new GoalModel(database)

const router = Router()

// Check User Authentication
import {checkAuth} from "../../middleware/authenticationStatus"
import {async} from "regenerator-runtime"

// Get object models
import {goals, mentorship, expertise} from "../../data-mapping/goals"

import {
    goalTitleValidation,
    goalTypeValidation,
    mentorshipTypeValidation,
    expertiseTypeValidation,
} from "../../validations/goal-validations"

// Initialize this once user is registered * ( So that we don't keep duplicate records )
router.post("/initialize", checkAuth, async (req, res, next) => {
    try {
        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const email = Decoded.user.email

        // Create the goal entry
        const goal = await Goal.createGoal({
            email,
            goal_title: "",
            goal_type: 1,
            user_status: true,
            deadLine_date: moment()
                .add(3, "months")
                .utc(),
            skills_pref: [],
            mentorship_pref: [],
            date_achieved: new Date().toUTCString(), // Temporary date - to be updated when program is completed.
        })

        // Respond with Success when entry is created.
        return res.status(200).json({
            status: 200,
            message: "Successfully initialized new goal",
            goal: goal,
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: "Goal entry not initialized.",
            error: error,
        })
    }
})

router.get("/info", checkAuth, async (req, res, next) => {
    try {
        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded._id

        // Get the Goal by Id
        const goal = await Goal.findById(userId)

        return res.status(200).json({
            status: 200,
            message: "Goal information retrieved successfully.",
            goal,
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: error,
        })
    }
})

router.put("/update-title", checkAuth, async (req, res, next) => {
    try {
        // Validations
        const {error} = goalTitleValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        // Get the id - user
        const userId = Decoded._id

        const goalTitle = await Goal.updateGoalTitle(userId, req.body.goal_title)

        console.log("Goal Controller: ", goalTitle)

        return res.status(200).json({
            status: 200,
            message: "Successfully updated the title.",
            goal: goalTitle,
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: error,
        })
    }
})

router.put("/update-type", checkAuth, async (req, res, next) => {
    try {
        // Validations
        const {error} = goalTypeValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        // Get user id - (userId)
        const userId = Decoded._id

        // Transform the data by mapping (object)
        const result = goals.types[req.body.goal_type]

        const goalType = await Goal.updateGoalType(userId, req.body.goal_type)

        return res.status(200).json({
            status: 200,
            message: "Successfully updated goal type.",
            goal: goalType,
            "data-mapping": result.type === req.body.goal_type ? result : "No data map available.",
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: error,
        })
    }
})

router.put("/mentorship-type", checkAuth, async (req, res, next) => {
    try {
        // Validations
        const {error} = mentorshipTypeValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token message
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        // Get user id
        const userId = Decoded._id

        const data = {type: req.body.mentorship_type}

        // Creating a data map. To return to the front-end.
        let mentorship_type = {
            type_1: mentorship.legend[data.type[0] - 1],
            type_2: mentorship.legend[data.type[1] - 1],
            type_3: mentorship.legend[data.type[2] - 1],
        }

        const mentorshipType = await Goal.updateMentorshipType(userId, [data.type[0], data.type[1], data.type[2]])

        return res.status(200).json({
            status: 200,
            message: "Successfully updated the mentorship type.",
            mentorshipType: mentorshipType,
            "data-mapping": mentorship_type ? mentorship_type : "No matching type found.",
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: error,
        })
    }
})

router.put("/expertise", checkAuth, async (req, res, next) => {
    try {
        // Validations
        const {error} = expertiseTypeValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded._id

        const result = expertise.types[req.body.expertise]

        const expertiseType = await Goal.updateGoalExpertise(userId, req.body.expertise)

        return res.status(200).json({
            status: 200,
            message: "Successfully updated the Expertise field.",
            expertiseType,
            "data-mapping": result.type === req.body.expertise ? result : "No matching type found.",
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: error,
        })
    }
})

export default router
