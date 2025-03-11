import { razorpayInstance } from "../config/envVars.js"
import { User } from '../models/userModel.js'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

export const createOrder = async (req, res) => {
    const { userId, amount } = req.body
    // console.log('Create Order Request:', req.body);

    if (!amount || !userId) {
        return res.status(400).json({ success: false, message: "Invalid reques. Missing amount or userId" })
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_order_${userId}`
    }

    try {
        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({ success: false, message: "something went wrong" })
    }
}

export const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature, userId, plan, amount } = req.body
    // console.log('Verify Payment Request:', req.body);
    const secret = process.env.RAZORPAY_SECRET_KEY
    try {
        if (!order_id || !payment_id || !signature) {
            console.log("missing required payment fields")
        }
        const hmac = crypto.createHmac("sha256", secret)

        hmac.update(order_id + "|" + payment_id)

        const generateSignature = hmac.digest("hex")

        //vconsole.log("Generated Signature:", generateSignature);
        // console.log("Provided Signature:", signature);

        if (generateSignature === signature) {
            // console.log("userId", userId)
            //await User.findByIdAndUpdate({ isSubscibed: true })

            let data = await User.findOneAndUpdate({ _id: userId }, { $set: { isSubscribed: true, subscriptionPlan: plan, amount } })
            // console.log("database update", data)
            return res.status(200).json({ success: true, message: "Payment Verified" })
        } else {
            return res.status(500).json({ success: false, message: "Invalid Payment Signature" })
        }
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
} 