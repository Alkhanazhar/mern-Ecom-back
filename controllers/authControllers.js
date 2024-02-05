const Order = require("../models/Order");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/authHelper");
const JWT = require("jsonwebtoken");

module.exports.registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;
        if (!name) {
            return res.send({ message: "Please enter your name" })
        }
        if (!email) {
            return res.send({
                message: "Please enter your email address"
            })
        }
        if (!password) {
            return res.send({
                message: "Please enter password"
            })
        }
        if (!phone) {
            return res.send({
                message: "Please enter phone number"
            })
        }
        if (!address) {
            return res.send({
                message: "Please enter your address"
            })
        }
        if (!role) {
            return res.send({ message: "Please enter role" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "user already exists"
            })
        }
        const hashedPassword = await hashPassword(password)
        const user = new User({ name, email, password: hashedPassword, address, role, phone })
        await user.save()
        res.status(200).send({
            success: true,
            message: "register succesfully",
            user
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).send({
            success: false,
            message: "error while registering"
        })
    }
}
module.exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.send("email or password not valid")
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).send({ success: false, message: "email not found" })
    }
    const match = await comparePassword(password, user.password)

    if (!match) {
        return res.status(400).send({ success: false, message: "password doesn't matched" })
    }
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
        },
        token
    })
}
module.exports.testController = (req, res, next) => {
    res.send("test controller")
}
module.exports.updateProfileController = async (req, res) => {
    try {
        const { name, password, address, phone } = req.body;
        const user = await User.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long " });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};
module.exports.getOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({ "buyer": req.user._id }).populate("products").populate("buyer")
        res.json(orders);
    } catch (error) {
        console.log(error.message);
    }

}