import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
import { ENV_VARS } from '../config/envVars.js'

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies['jwt-netflix']
        // const token = req.headers['cookie'].split("jwt-netflix=")[1]

        // console.log("token", token)

        // console.log(atob(token.trim()))

        if (!token) {
            // console.log("No Token is found in Cookies")
            return req.status(401).json({ success: false, message: "Unathorized - No Token Provided" })
        }

        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        // console.log("Decoded Token", decoded)

        if (!decoded || !decoded.userId) {
            // console.log("Decoded Toekn does not contain userId")
            return res.status(401).json({ success: false, message: "Unathorized - Invalid Token" })
        }

        const user = await User.findById(decoded.userId).select("-password")

        // console.log("User Found", user)

        if (!user) {
            console.log("User not found in the database", decoded.userId)
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // console.log("User ", user)

        req.user = user;

        next()
    } catch (error) {
        console.log("Error in protectedRoute middleware: ", error.message)
        req.status(500).json({ success: false, message: "Internal Server Error" })
    }
}