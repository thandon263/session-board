import jwt from "jsonwebtoken"
import {async} from "regenerator-runtime"

export const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET)
        req.userData = decoded

        console.log("Inforamtion: ", "background: green; color: light-green", decoded)
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Authentication Failed.",
        })
    }
}
