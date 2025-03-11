import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'


export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isSubscribing: false,
    // isSubscribed: false,

    signup: async (credentials) => {
        set({ isSigningUp: true })
        try {
            // console.log("Sending Signup Request:", { credentials })
            const response = await axios.post("/api/v1/auth/signup", credentials)
            // console.log("SignUp Response: ", response.data.user)
            set({ isSigningUp: false })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error.response.data)
            toast.error(error.response.data.message || "signup failed")
            set({ isSigningUp: false, user: null })
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true })
        try {
            const response = await axios.post("/api/v1/auth/login", credentials, { withCredentials: true })
            // console.log("Login Response: ", response)
            set({ user: response.data.user, isLoggingIn: false })
            toast.success(response.data.message)
            return true
        } catch (error) {
            set({ isLoggingIn: false, user: null })
            console.log(error)
            toast.error(error.response.data.message || "Login Failed")
            return false
        }
    },

    logout: async () => {
        set({ isLoggingOut: true })
        try {
            await axios.post("/api/v1/auth/logout");
            set({ user: null, isLoggingOut: false })
        } catch (error) {
            set({ isLoggingOut: false })
            toast.error(error.response.data.message || "Logut Failed")
        }
    },

    authCheck: async () => {
        // console.log("authcheck console")
        set({ isCheckingAuth: true })
        try {
            const response = await axios.get("/api/v1/auth/authCheck", { withCredentials: true })
            // console.log("auth response: ", response.data)
            set({ user: response.data.user, isCheckingAuth: false })
        } catch (error) {
            set({ isCheckingAuth: false, user: null })
            console.log("AuthCheck Failed", error.response?.data || error.data)
        }
    },

    updateSubscription: async (data) => {
        const { userId } = data
        // const { plan, price } = data
        console.log("from update subscription check")
        set({ isSubscribing: true })
        try {
            // const { data } = await axios.post("/api/v1/subscribe/createOrder", { plan }, { withCredentials: true })
            // console.log("data from updateSubscription", data)
            // set({ userId, isSubscribing: false, isSubscribed: true })
            // const response = await axios.post("/api/v1/auth/subscribe", { plan, price }, { withCredentials: true });
            set({ userId, isSubscribing: false })
            toast.success("Thank you for subscribing! Enjoy the content.")
            return true
        } catch (error) {
            console.log("Error in updateSubscription:", error);
            console.log("Error Response Data:", error.response?.data);
            console.log("Error Response Status:", error.response?.status);
            console.log("Subscription Update Failed", error.response?.data || error)
            toast.error(error.response?.data?.message || "Subscription Update Failed")
            return false
        }
    }
}))