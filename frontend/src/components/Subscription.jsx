import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "./Store/authUser"
import axios from 'axios'


export const SubscriptionPage = () => {

    const [selectedPlan, setSelectedPlan] = useState("")
    const [price, setPrice] = useState(null)

    const navigate = useNavigate()
    const { isSubscribed, user, updateSubscription } = useAuthStore()
    const userId = user._id
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlan = ({ plan, price }) => {
        setSelectedPlan(plan)
        setPrice(price)

    }
    console.log(selectedPlan, price)

    useEffect(() => {
        loadRazorpayScript().then((success) => {
            if (!success) {
                console.error("Razorpay SDK failed to load. Check your internet connection.");
            }
        });
    }, []);

    const handleSubscribe = async () => {
        try {

            // API call to create an order
            const response = await axios.post("/api/v1/subscribe/createOrder", {
                amount: price, userId // Assuming the plan price is stored in `selectedPlan.price`
            });
            const { order } = response.data
            console.log("subscribe data", order)
            console.log("userId from handle subscribe", userId, price)

            // Razorpay options 
            console.log({ printKey: import.meta.env.VITE_RAZORPAY_KEY_ID })
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay Key ID from env
                amount: order.amount,
                currency: order.currency,
                order_id: order.id, // Order ID generated from the server
                name: "Netflix Entertainment Service",
                description: `Subscribe to the ${selectedPlan} plan`,
                handler: async (response) => {
                    // Verify payment on the server
                    const verifyResponse = await axios.post("/api/v1/subscribe/verifypayment", {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        userId,
                        plan: selectedPlan,
                        amount: price
                    });
                    console.log("verify response", verifyResponse)

                    if (verifyResponse.data.success) {
                        // Update subscription after successful payment
                        const success = await updateSubscription({ userId });
                        if (success) {
                            // await axios.post("/api/v1/auth/authchek")
                            // await authCheck()
                            navigate("/")
                        }

                    } else {
                        alert("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                },
                theme: {
                    color: "#0071EB",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Error during subscription:", error);
            alert("Subscription failed. Please try again.");
        }
    };


    return (
        <div className="h-screen" >
            <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
                <div className="flex items-center gap-10 z-50">
                    <Link to="/">
                        <img src="/logo.png" alt="Netflix Logo" className="w-32 sm:w-40" />
                    </Link>
                </div>
            </header>
            <hr className="text-bold" />
            <div className="flex items-center justify-center p-20">
                <div className="w-[90%]">
                    <h1 className="text-4xl text-gray-700 font-semibold pb-4">Choose the plan that's right for you</h1>
                    <form className="hidden lg:block">
                        <div className="flex items-center gap-4 ">
                            <div id="mobile" className={`border-gray-400 border-2 p-5 rounded-2xl h-[920px] w-[20%] overflow-auto cursor-pointer scrollbar-hide ${selectedPlan === "mobile" ? "shadow-2xl" : ""}`}
                                onClick={() => handlePlan({ plan: "mobile", price: 149 })}>
                                <div className=" text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle1"
                                >
                                    <span>Mobile</span>
                                    <span>480p</span>
                                    {selectedPlan === "mobile" ?
                                        <div className="default-ltr-cache-1a130f1 e1smm5nu0" size="14">
                                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                </path>
                                            </svg>
                                        </div> : ""}
                                </div>
                                <ul>
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Monthly Price</span>
                                        <span className="text-gray-700">₹149</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Video and sound quality</span>
                                        <span className="text-gray-700">Fair</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Resolution</span>
                                        <span className="text-gray-700">480p</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Supported devices</span>
                                        <span>Mobile phone, tablet</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Devices your household can watch at the same time</span>
                                        <span className="text-gray-700">1</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 mb-20 flex flex-col font-semibold">
                                        <span className="text-gray-500">Download Devices</span>
                                        <span className="text-gray-700">1</span>
                                    </li>
                                </ul>
                            </div>
                            <div id="basic" className={`border-gray-400 border-2 p-5 rounded-2xl h-[920px] w-[20%] overflow-auto cursor-pointer scrollbar-hide ${selectedPlan === "basic" ? "shadow-2xl" : ""}`}
                                onClick={() => handlePlan({ plan: "basic", price: 199 })}>
                                <div>
                                    <div className=" text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle2"
                                    >
                                        <span>Basic</span>
                                        <span>720p</span>
                                        {selectedPlan === "basic" ?
                                            <div className="default-ltr-cache-1a130f1 e1smm5nu0" size="14">
                                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                    </path>
                                                </svg>
                                            </div> : ""}
                                    </div>
                                    <ul>
                                        <li className="p-6 flex flex-col font-semibold">
                                            <span className="text-gray-500">Monthly Price</span>
                                            <span className="text-gray-700">₹199</span>
                                        </li>
                                        <hr />
                                        <li className="p-6 flex flex-col font-semibold">
                                            <span className="text-gray-500">Video and sound quality</span>
                                            <span className="text-gray-700">Good</span>
                                        </li>
                                        <hr />
                                        <li className="p-6 flex flex-col font-semibold">
                                            <span className="text-gray-500">Resolution</span>
                                            <span className="text-gray-700">720p(HD)</span>
                                        </li>
                                        <hr />
                                        <li className="p-6 flex flex-col font-semibold">
                                            <span className="text-gray-500">Supported devices</span>
                                            <span className="text-gray-700">TV, Computer, Mobile phone, tablet</span>
                                        </li>
                                        <hr />
                                        <li className="p-6 flex flex-col font-semibold">
                                            <span className="text-gray-500">Devices your household can watch at the same time</span>
                                            <span className="text-gray-700">1</span>
                                        </li>
                                        <hr />
                                        <li className="p-6 mb-20 flex flex-col font-semibold">
                                            <span className="text-gray-500">Download Devices</span>
                                            <span className="text-gray-700">1</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div id="standard" className={`border-gray-400 border-2 p-5 rounded-2xl h-[920px] w-[20%] overflow-auto cursor-pointer scrollbar-hide ${selectedPlan === "standard" ? "shadow-2xl" : ""}`}
                                onClick={() => handlePlan({ plan: "standard", price: 499 })}>
                                <div className=" text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle3"
                                >
                                    <span>Standard</span>
                                    <span>1080p</span>
                                    {selectedPlan === "standard" ?
                                        <div className="default-ltr-cache-1a130f1 e1smm5nu0" size="14">
                                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                </path>
                                            </svg>
                                        </div> : ""}
                                </div>
                                <ul>
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Monthly Price</span>
                                        <span className="text-gray-700">₹499</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Video and sound quality</span>
                                        <span className="text-gray-700">Great</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Resolution</span>
                                        <span className="text-gray-700">1080p(Full HD)</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Supported devices</span>
                                        <span className="text-gray-700">TV, Computer, Mobile phone, tablet</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Devices your household can watch at the same time</span>
                                        <span className="text-gray-700">2</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 mb-20 flex flex-col font-semibold">
                                        <span className="text-gray-500 ">Download Devices</span>
                                        <span className="text-gray-700">2</span>
                                    </li>
                                </ul>
                            </div>
                            <div id="premium" className={`border-gray-400 border-2 p-5 rounded-2xl h-[920px] w-[20%] overflow-auto cursor-pointer scrollbar-hide ${selectedPlan === "premium" ? "shadow-2xl" : ""}`}
                                onClick={() => handlePlan({ plan: "premium", price: 649 })}>
                                <div className=" text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle4"
                                >
                                    <span>Premium</span>
                                    <span>4K + HDR</span>
                                    {selectedPlan === "premium" ?
                                        <div className="default-ltr-cache-1a130f1 e1smm5nu0 text-end" size="14">
                                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                </path>
                                            </svg>
                                        </div> : ""}
                                </div>
                                <ul>
                                    <li className="p-8 flex flex-col font-semibold">
                                        <span className="text-gray-500">Monthly Price</span>
                                        <span className="text-gray-700">₹649</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Video and sound quality</span>
                                        <span className="text-gray-700">Best</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Resolution</span>
                                        <span className="text-gray-700">4K(Ultra HD) + HDR</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500">Spatial audio (immersive sound)</span>
                                        <span className="text-gray-700">Included</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500 font-semibold">Supported devices</span>
                                        <span className="text-gray-700">TV, Computer, Mobile phone, tablet</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 flex flex-col font-semibold">
                                        <span className="text-gray-500 font-semibold">Devices your household can watch at the same time</span>
                                        <span className="text-gray-700">1</span>
                                    </li>
                                    <hr />
                                    <li className="p-6 mb-20 flex flex-col font-semibold">
                                        <span className="text-gray-500">Download Devices</span>
                                        <span className="text-gray-700">1</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </form>

                    {/* Mobile View */}

                    <form className="lg:hidden">
                        <div>
                            <div className="flex gap-2">
                                <div className={selectedPlan === "mobile" ? "text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle1 cursor-pointer" :
                                    "text-black font-bold flex flex-col p-5 items-start rounded-2xl  cursor-pointer border-2"}
                                    onClick={() => handlePlan({ plan: "mobile", price: 149 })}>
                                    <span>Mobile</span>
                                    <span>480p</span>
                                    {selectedPlan === "mobile" ?
                                        <div className="default-ltr-cache-1a130f1 e1smm5nu0" size="14">
                                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                </path>
                                            </svg>
                                        </div> : ""}
                                </div>
                                <div>
                                    <div className="bg-gray-700  rounded-t-lg">
                                        <h1 className="text-white text-sm text-center">Most Popular</h1>
                                    </div>
                                    <div className={selectedPlan === "basic" ? "text-white font-bold flex flex-col p-5 items-start rounded-b-2xl  cardStyle2 cursor-pointer" :
                                        "text-black font-bold flex flex-col p-5 items-start rounded-b-2xl  cursor-pointer border-2"}
                                        onClick={() => handlePlan({ plan: "basic", price: 199 })}>
                                        <span>Basic</span>
                                        <span>720p</span>
                                        {selectedPlan === "basic" ?
                                            <div className="default-ltr-cache-1a130f1 e1smm5nu0" size="14">
                                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                    </path>
                                                </svg>
                                            </div> : ""}
                                    </div>
                                </div>
                                <div className={selectedPlan === "standard" ? "text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle3 cursor-pointer" :
                                    "text-black font-bold flex flex-col p-5 items-start rounded-2xl  cursor-pointer border-2"}
                                    onClick={() => handlePlan({ plan: "standard", price: 499 })}>
                                    <span>Standard</span>
                                    <span>1080p</span>
                                    {selectedPlan === "standard" ?
                                        <div className="default-ltr-cache-1a130f1 e1smm5nu0" size="14">
                                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                </path>
                                            </svg>
                                        </div> : ""}
                                </div>
                                <div className={selectedPlan === "premium" ? "text-white font-bold flex flex-col p-5 items-start rounded-2xl cardStyle4 cursor-pointer" :
                                    "text-black font-bold flex flex-col p-5 items-start rounded-2xl  cursor-pointer border-2"}
                                    onClick={() => handlePlan({ plan: "premium", price: 649 })}>
                                    <span>Premium</span>
                                    <span>4K + HDR</span>
                                    {selectedPlan === "premium" ?
                                        <div className="default-ltr-cache-1a130f1 e1smm5nu0 text-end" size="14">
                                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className="success-icon" data-uia="success-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="#0071EB">
                                                </path>
                                            </svg>
                                        </div> : ""}
                                </div>

                            </div>
                            <div>
                                {selectedPlan === "mobile" && (
                                    <div>
                                        <ul>
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Monthly Price</span>
                                                <span>₹149</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Video and sound quality</span>
                                                <span>Fair</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Resolution</span>
                                                <span>480p</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Supported devices</span>
                                                <span>Mobile phone, tablet</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Devices your household can watch at the same time</span>
                                                <span>1</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 mb-20 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Download Devices</span>
                                                <span>1</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                {selectedPlan === "basic" && (
                                    <div>
                                        <ul>
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Monthly Price</span>
                                                <span>₹199</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Video and sound quality</span>
                                                <span>Good</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Resolution</span>
                                                <span>720p(HD)</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Supported devices</span>
                                                <span>TV, Computer, Mobile phone, tablet</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Devices your household can watch at the same time</span>
                                                <span>1</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 mb-20 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Download Devices</span>
                                                <span>1</span>
                                            </li>
                                        </ul>
                                    </div>

                                )}
                                {selectedPlan === "standard" && (
                                    <div>
                                        <ul>
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Monthly Price</span>
                                                <span>₹499</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Video and sound quality</span>
                                                <span>Great</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Resolution</span>
                                                <span>1080p(Full HD)</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Supported devices</span>
                                                <span>TV, Computer, Mobile phone, tablet</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Devices your household can watch at the same time</span>
                                                <span>2</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 mb-20 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Download Devices</span>
                                                <span>2</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                {selectedPlan === "premium" && (
                                    <div>
                                        <ul>
                                            <li className="p-8 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Monthly Price</span>
                                                <span>₹649</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Video and sound quality</span>
                                                <span>Best</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Resolution</span>
                                                <span>4K(Ultra HD) + HDR</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Spatial audio (immersive sound)</span>
                                                <span>Included</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Supported devices</span>
                                                <span>TV, Computer, Mobile phone, tablet</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Devices your household can watch at the same time</span>
                                                <span>1</span>
                                            </li>
                                            <hr />
                                            <li className="p-6 mb-20 flex justify-between">
                                                <span className="text-gray-500 font-semibold">Download Devices</span>
                                                <span>1</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                            </div>
                        </div>
                    </form>

                    <div className="text-gray-500 mt-5 mb-5">
                        <p>
                            HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject to your internet service and device capabilities. Not all content is available in all resolutions. See our Terms of Use for more details.
                        </p>
                        <p>
                            Only people who live with you may use your account. Watch on 4 different devices at the same time with Premium, 2 with Standard, and 1 with Basic and Mobile.
                        </p>
                        <p>Live events are included with any Netflix plan and contain ads.</p>
                    </div>

                    <div className=" text-white rounded-sm ">
                        <button className="bg-red-600 h-[50px] w-[200px] p-2 text-2xl rounded-sm" onClick={handleSubscribe}>
                            {isSubscribed ? "Processing....." : "Pay & Subscribe"}</button>
                    </div>

                </div>
            </div >

        </div >
    )
}