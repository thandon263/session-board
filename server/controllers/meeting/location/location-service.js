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
import Location from "../../../models/meetings/location/location-model"

// Check User Authentication
import {checkAuth} from "../../../middleware/authenticationStatus"

// Initialize class (Date may class with the static Date() class)
const LocationModel = new Location(database)

// Validations for the location
import {newLocationValidation, updateLocationValidation} from "../../../validations/location-validation"

router.post("/new-location", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = newLocationValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode auth token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        // User Id Info
        const userId = Decoded.user.id

        const locationObject = JSON.stringify(req.body.location)

        const skypeId = await LocationModel.updateSkypeId(userId, req.body.skypeId)

        // Create new location
        const newLocation = await LocationModel.createNewLocation({
            userId: userId,
            name: req.body.name,
            location: locationObject,
        })

        return res.status(200).json({
            status: 200,
            message: "Successfully saved new location.",
            location: newLocation,
            skypeId: skypeId,
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
        // Decode the auth token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        // User Id from token
        const userId = Decoded.user.id

        // Get location data
        const getLocation = await LocationModel.getLocationInfo({userId: userId})

        // Get skype Id
        const skype = await LocationModel.findSkypeId(userId)

        return res.status(200).json({
            status: 200,
            message: "Successfully retrieved the location data",
            location: getLocation,
            skypeId: skype,
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error,
        })
    }
})

// Update the location data
router.patch("/update-location", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = updateLocationValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        // Decode the Auth Token
        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const userId = Decoded.user.id

        // Update the location Info (locationId, userId, name, location)
        const updatedLocation = await LocationModel.updateLocation({
            id: req.body.locationId,
            userId: userId,
            name: req.body.name,
            location: req.body.location,
        })

        return res.status(200).json({
            status: 200,
            message: "Successfully saved new location.",
            location: updatedLocation,
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
