import { User } from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookie } from "../utils/generateToken.js";



export async function SignUp(req, res) {
    try {
        // console.log("SignUp Route Hit: ", req.body)
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(401).json({ message: "All fields are required", success: false });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters", success: false });
        }

        const user = await User.findOne({ $or: [{ email }, { username: userName }] });

        // console.log(user)

        if (user) {
            if (user.email === email) {
                return res.status(401).json({ message: "Email already exists", success: false });
            }
            if (user.username === userName) {
                return res.status(401).json({ message: "userName already exists", success: false });
            }
        }

        // console.log("hashing the password")

        const hashedPassword = await bcryptjs.hash(password, 15);
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            username: userName,
            email,
            password: hashedPassword,
            image,
        });

        await newUser.save();

        // console.log("saved the user")

        // generateTokenAndSetCookie(newUser._id, res);


        return res.status(201).json({ message: "Account created successfully", success: true, user: { ...newUser._doc, password: "", } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or Password",
                success: false
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or Password",
                success: false
            })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            message: `welcome ${user.username}`,
            user,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("jwt-netflix")
        res.status(200).json({
            message: "User Logged Out Successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export async function Subscribe(req, res) {
    // console.log("Request Body: ", req.body)
    try {
        const { plan, price } = req.body
        if (!plan && !price) {
            return res.status(404).json({ success: false, message: "No plan selected" })
        }
        const userId = req.user._id

        const user = await User.findByIdAndUpdate(
            userId,
            { isSubscribed: true, subscriptionPlan: plan, amount: price },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "Subscription Successfull", user })


    } catch (error) {

        console.log("Error seubscriber controller", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }

}

export async function authCheck(req, res) {
    try {
        // console.log("req.user:", req.user)
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user: req.user })
    } catch (error) {
        console.log("Error in authCheck Controller: ", error.message)
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }
}