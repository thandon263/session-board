import express from "express"
import pino from "pino"
import expressPino from "express-pino-logger"
import morgan from "morgan"
import bodyParser from "body-parser"

// Import routes from controllers
import AuthRouter from "./controllers/authentication/auth-service"
import ProfileRouter from "./controllers/profile/profile-service"
import AccountRouter from "./controllers/profile/account-service"
import GoalRouter from "./controllers/goal/goals-controller"
import TimeRouter from "./controllers/meeting/time/times-service"
import AvailabilityRouter from "./controllers/meeting/availability/availability-service"
import LocationRouter from "./controllers/meeting/location/location-service"
import MeetingRouter from "./controllers/meeting/meeting-service"
import MilestoneRouter from "./controllers/milestone/milestone-service"

// Import middlewares from middlewares
import {checkAuth} from "./middleware/authenticationStatus"

// Setup app version
const manager = {
    version: "v1",
}

const app = express()
const logger = pino({level: process.env.LOG_LEVEL || "info"})
const expressLogger = expressPino({logger})

app.use(expressLogger)
app.use(morgan("combined"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Controller Routes - Middleware
app.use(`/api/${manager.version}/auth`, AuthRouter)
app.use(`/api/${manager.version}/profile`, ProfileRouter)
app.use(`/api/${manager.version}/account`, AccountRouter)
app.use(`/api/${manager.version}/goal`, GoalRouter)
app.use(`/api/${manager.version}/time`, TimeRouter)
app.use(`/api/${manager.version}/availability`, AvailabilityRouter)
app.use(`/api/${manager.version}/location`, LocationRouter)
app.use(`/api/${manager.version}/meeting`, MeetingRouter)
app.use(`/api/${manager.version}/milestone`, MilestoneRouter)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, GET, DELETE")
        return res.status(100).json({})
    }

    next()
})

app.get("/", (req, res, next) => {
    res.status(200).json({
        status: 200,
        code: "HOME_PAGE",
        version: "1.0.0",
        payload: {
            message: "Welcome to #MOVETHEDIAL",
        },
    })
})

app.get("/ping", checkAuth, (req, res, next) => {
    res.status(200).json({
        status: 200,
        code: "HOME_PAGE",
        version: "1.0.0",
        payload: {
            message: "pong",
        },
    })
})

app.use((req, res, next) => {
    const error = new Error("Not Found!")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    })
})

module.exports = app
