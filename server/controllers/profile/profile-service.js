import {Router} from "express"
import jwt from "jsonwebtoken"

// Setup the environment
const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../knexfile")[environment]
// Database
const database = require("knex")(configuration)

const router = Router()

import UserModel from "../../models/authentication/user-model"
import Profile from "../../models/profile/profile-model"

// Instantiate the profile class (Model)
const UserService = new UserModel(database)
const ProfileService = new Profile(database)

// Check User Authentication
import {checkAuth} from "../../middleware/authenticationStatus"

// Get validations
import {
    profileValidation,
    profileNamesValidation,
    profilePeopleManagedValidation,
    profileBioValidation,
    profileImageUrlValidation,
    profileEmailValidation,
    profilePasswordValidation,
} from "../../validations/profile-validations"
import {async} from "regenerator-runtime"

// Import Multer upload for local storage
import {upload, uploadS3} from "../../middleware/imageStorage"
// Add the Multer S3 to push to either Heroku Storage or Amazon storage.
// Look for alternatives that work better for the team.
router.post("/new", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = profileValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const token = req.headers.authorization
        const Decoded = jwt.decode(token, {json: true})

        const email = Decoded.user.email

        console.log("Information: ", Decoded)

        const user = await ProfileService.find(email)

        const profile = await ProfileService.create({
            email: user.email,
            job_title: req.body.job_title,
            bio: req.body.bio,
            image_url: req.body.image_url,
            people_managed: req.body.people_managed,
        })

        return res.status(200).json({
            status: 200,
            message: "Profile Created Successfully.",
            profile: profile,
        })
    } catch (error) {
        return res.status(404).json({
            status: 404,
            message: error.message,
            error: "Create Profile failed.",
        })
    }
})

// Get Pofile from DB
router.get("/info", checkAuth, async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const userInfo = jwt.decode(token, {json: true})
        // Extract user Id from the token
        const userId = userInfo.user.id

        const names = await ProfileService.findNamesByEmail(userInfo.user.email)

        const profile = await ProfileService.findById(userId)

        const result = {...names, ...profile}

        return res.status(200).json({
            status: 200,
            message: "GET/ Profile successful.",
            profile: result,
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "Profile not found.",
            error: error.message,
        })
    }
})

// Update profile Names
router.put("/update/names", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = profileNamesValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const token = req.headers.authorization
        const userInfo = jwt.decode(token, {json: true})

        const userId = userInfo.user.id

        // Update User Names by ID
        const profile = await ProfileService.updateUserName(userId, req.body.first_name, req.body.last_name)

        return res.status(200).json({
            status: 200,
            message: "User names updated Successfully.",
            profile: profile,
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "User Profile not updated.",
            error: error.message,
        })
    }
})

// Update Profile People Managed
// # Add the migration column for profession / role to Profiles table
router.patch("/update/people", checkAuth, async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = profilePeopleManagedValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const token = req.headers.authorization
        const userInfo = jwt.decode(token, {json: true})

        // User Id from token
        const userId = userInfo.user.id

        // Update User people managed (Profile)
        const profile = await ProfileService.updatePeopleAndJob(userId, req.body.job_title, req.body.people_managed)

        return res.status(200).json({
            status: 200,
            message: "Job and People updated successfully.",
            profile: profile,
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "User Profile not updated.",
            error: error.message,
        })
    }
})

// Update Profile Bio
router.patch("/update/bio", checkAuth, async (req, res, next) => {
    try {
        // // Validate User Data
        const {error} = profileBioValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const token = req.headers.authorization
        const userInfo = jwt.decode(token, {json: true})

        const userId = userInfo.user.id

        const profile = await ProfileService.updateProfileBio(userId, req.body.bio)

        return res.status(200).json({
            status: 200,
            message: "Profile bio updated successfully.",
            profile: profile,
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "User bio not updated.",
            error: error.message,
        })
    }
})

router.put("/update/email", checkAuth, async (req, res, next) => {
    try {
        const {error} = profileEmailValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const token = req.headers.authorization
        const userInfo = jwt.decode(token, {json: true})

        const userId = userInfo.user.id

        const profile = await ProfileService.updateUserEmail(userId, req.body.email)

        return res.status(200).json({
            status: 200,
            message: "Profile email updated successfully.",
            profile: profile,
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "User email not updated.",
            error: error.message,
        })
    }
})

router.put("/update/password", checkAuth, async (req, res, next) => {
    try {
        const {error} = profilePasswordValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const token = req.headers.authorization
        const userInfo = jwt.decode(token, {json: true})

        const userId = userInfo.user.id

        const hashedPassword = await UserService.generateHash(req.body.password, 10)

        const profile = await ProfileService.updatePassword(userId, hashedPassword)

        return res.status(200).json({
            status: 200,
            message: "Profile password updated successfully.",
            profile: profile,
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "User password not updated.",
            error: error.message,
        })
    }
})

const uploadImage = uploadS3.single("photo")
// Update Profile Image Url
router.patch("/update/image", checkAuth, async (req, res, next) => {
    try {
        // Profile Image upload
        await uploadImage(req, res, async function(err) {
            if (err) return res.status(400).json({error: err})
            // Validate User Data
            const {error} = profileImageUrlValidation(req.body)
            if (error) return res.status(400).json({status: 400, error: error.details[0].message})

            // Get the tken and validate
            const token = req.headers.authorization
            const userInfo = jwt.decode(token, {json: true})
            // Get User Id
            const userId = userInfo.user.id

            const image = req.file.location
            console.log("File destination: ", image)
            const profile = await ProfileService.updateProfileImage(userId, image)
            // Response to the Client
            return res.status(200).json({
                status: 200,
                message: "Profile image updated successfully.",
                profile: profile,
            })
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "User image not updated.",
            error: error.message,
        })
    }
})

export default router
