const JWT = require("jsonwebtoken")
const User = require("../models/User")

module.exports.protectingRoute = (req, res, next) => {
    try {
        
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode;
        // console.log(decode)
        next()
    } catch (error) {
        console.log("error protecting Routes", error.message)
        res.status(500).send(error.message)
    }
}
module.exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (user.role != "admin") {
            return res.status(404).send({ message: "unauthorized user" })
        }
        next()
    } catch (error) {
        console.log(error.message)
        res.send({ message: "error while checking user role" })
    }
}
