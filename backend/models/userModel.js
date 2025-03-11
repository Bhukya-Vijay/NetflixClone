import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    image: {
        type: String,
        default: ""
    },
    searchHistory: {
        type: Array,
        default: []
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: null
    }

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)