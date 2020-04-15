require("dotenv").config()
import {Router} from "express"
import sgMail from "@sendgrid/mail"
import jwt from "jsonwebtoken"
import moment from "moment"

// Services
import EmailService from "../../services/email-service"

// Import the Email Template you want to send to User
// Example: (Forgot-Password, Registration, Welcome, Support Email)

const environment = process.env.NODE_ENV || "development"

const configuration = require("../../../knexfile")[environment]

const database = require("knex")(configuration)

const router = Router()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Import Models
import UserModel from "../../models/authentication/user-model"
import ProfileModel from "../../models/profile/profile-model"

// Import validations
import {
    loginValidation,
    registerValidation,
    passwordUpdateValidation,
    resetPasswordValidation,
} from "../../validations/auth-validations"
import {checkAuth} from "../../middleware/authenticationStatus"

// Initialize Models
const User = new UserModel(database)
const Profile = new ProfileModel(database)
const Mail = new EmailService(sgMail)

router.post("/register", async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = registerValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})
        // Hash the password
        const hashedPassword = await User.generateHash(req.body.password, 10)

        const userInfo = User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
            mentor: req.body.mentor,
            mentee: req.body.mentee,
        }).catch(error => {
            return res.status(401).json({
                status: 401,
                error: error,
            })
        })

        const user = await userInfo

        await Profile.create({
            email: req.body.email,
            job_title: "",
            bio: "",
            image_url: "",
            people_managed: 0,
            skype_id: "",
        })

        return res.status(200).json({
            status: 200,
            message: "New User Registered.",
            user: user,
        })
    } catch (error) {
        // console.error(error)
        res.status(500).json({
            status: 500,
            error: error.message,
        })
    }
})

router.post("/login", async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = loginValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const userInfo = User.find(req.body.email)

        const user = await userInfo

        const validPassword = await User.validateUser(req.body.password, user.password)

        if (!validPassword)
            return res.status(400).send({
                status: 400,
                error: {
                    message: "Password is invalid",
                },
            })

        // Create a on User class (Send to the Database - update the Last_login)
        const last_login = await User.updateLastLogin(user.id)
        // const userInfo = User.updateLogIn Info.

        const token = jwt.sign({_id: user.id, user: user, loginInfo: {...last_login}}, process.env.TOKEN_SECRET)

        console.log("Token login: ", token)

        return res
            .header("Authorization", token)
            .status(200)
            .json({
                status: 200,
                message: "Logged In",
                auth_token: token,
                loginInfo: {...last_login},
            })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "User Not Found",
            error: error,
        })
    }
})

router.put("/update-password", async (req, res, next) => {
    try {
        // Validate User Data
        const {error} = passwordUpdateValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const user = await User.find(req.body.email)

        const hashedPassword = await User.generateHash(req.body.password, 10)

        const userInfo = User.updatePassword(user.id, hashedPassword)

        const updated = await userInfo

        return res.status(200).json({
            status: 200,
            message: "Password Updated.",
            user: updated,
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Password Not Updated.",
            error: error,
        })
    }
})

router.post("/forgot-password", async (req, res, next) => {
    try {
        const user = await User.find(req.body.email)

        const {resetCode, updated_at} = await User.resetPassword(user.email)

        // console.log("Result - Data: ", resetCode)
        let timeOfValidToken = moment(updated_at)
            .startOf("hour")
            .fromNow()

        const email = await Mail.send(user.first_name, user.email, timeOfValidToken, resetCode)

        // console.log("Result - Data: ", email)

        return res.status(202).json({
            status: 200,
            message: "Sending email successful.",
            response: email,
            code: resetCode,
        })
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: "Email Not Sent.",
            error: error,
        })
    }
})

router.get("/reset-password", async (req, res, next) => {
    // This is currently a GET / request, once all is set we
    // Have to turn it into a PATCH / request to update password.
    try {
        const code = req.query.code

        // Add the update-password method and also check the resetCode
        // If it's valid to reset the password.
        // User.updatePassword(userId, password)
        const {user_id, first_created, last_modified} = await User.findResetPasswordEntry(code)

        const validateToken = moment(last_modified).add(16, "hours") > moment()

        if (validateToken) {
            return res.status(201).json({
                status: 201,
                resetCode: code,
                message: "Token is still valid, reset password.",
                timestamps: {
                    first_created,
                    last_modified,
                },
                isCodeValid: validateToken,
            })
        }

        return res.status(200).json({
            status: 200,
            resetCode: code,
            message: "Token is no longer valid, request a new reset code.",
            timestamps: {
                first_created,
                last_modified,
            },
            isCodeValid: validateToken,
        })
    } catch (error) {
        res.status(401).json({
            status: 401,
            resetCode: "",
            error: error,
        })
    }
})

// Create User reset password PATCH / route.
router.patch("/users/password", async (req, res, next) => {
    try {
        const code = req.body.code
        const password = req.body.password

        const {error} = resetPasswordValidation(req.body)
        if (error) return res.status(400).json({status: 400, error: error.details[0].message})

        const {user_id, reset_code, last_modified} = await User.findResetPasswordEntry(code)

        const validateToken = moment(last_modified).add(16, "hours") > moment()

        if (validateToken) {
            let hashedPassword = await User.generateHash(password, 10)
            const updatedPassword = await User.updatePassword(user_id, hashedPassword)

            return res.status(200).json({
                status: 200,
                message: "Password Updated Successfully.",
                user: updatedPassword,
            })
        } else {
            // Respond with token not valid.
            // Request a new token.
            return res.status(301).json({
                status: 301,
                message: "Reset code is no longer valid anymore, request a new code.",
                isCodeValid: validateToken,
            })
        }
    } catch {
        res.status(401).json({
            status: 401,
            message: "Password Reset Failed.",
            error: error,
        })
    }
})

router.get("/user-status", checkAuth, async (req, res, next) => {
    const user = await User.find(req.body.email)

    const status = (moment(user.last_logout) ? user.last_logout !== "null" : 0) < moment(user.last_login)

    if (status) {
        return res.status(200).json({
            status: 200,
            online: status,
            message: "Online",
        })
    }

    return res.status(200).json({
        status: 200,
        online: status,
        message: "Offline",
    })
})

router.post("/logout", async (req, res, next) => {
    const user = await User.find(req.body.email)

    const last_Logout = await User.updateLastLogout(user.id)

    // Check if the request header exists (auth-token)
    if (!res.hasHeader("Authorization"))
        return res
            .header("Authorization", "")
            .status(200)
            .send({
                status: 200,
                payload: {
                    message: "Logged Out",
                    auth_token: "",
                    loginInfo: {...last_Logout},
                },
            })
})

export default router
