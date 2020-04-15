import {Router} from "express"
import jwt from "jsonwebtoken"
// Setup the environment
const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../knexfile")[environment]
// Database
const database = require("knex")(configuration)

// Models
import AccountModel from "../../models/profile/account-issues"

const router = Router()

// Check User Authentication
import {checkAuth} from "../../middleware/authenticationStatus"

// Initialize the AccountModel
const AccountService = new AccountModel(database)

import {async} from "regenerator-runtime"

router.get("/info", checkAuth, async (req, res, next) => {
    try {
        // Get the issue from database.
        const issue = await AccountService.findIssue(req.body.issueId)
        console.log("ID For Issue: ", issue)
        // Send back response from request.
        return res.status(200).json({
            status: 200,
            issueId: issue.id,
            issueType: issue.issue_type,
            created_at: issue.created_at,
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: error,
        })
    }
})

router.post("/new", checkAuth, async (req, res, next) => {
    try {
        // Create a new issue
        const newIssue = await AccountService.createIssue(req.body.issueType)
        // Respond with newIssue Id and Type
        return res.status(200).json({
            status: 200,
            issueId: newIssue.id,
            issueType: newIssue.issueType,
            created_at: newIssue.created_at,
            message: "New Issue Successfully Created.",
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: "Issue not created.",
        })
    }
})

router.put("/update", checkAuth, async (req, res, next) => {})

export default router
