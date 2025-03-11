import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "./Store/authUser.js"


const SignUp = () => {
    const { searchParams } = new URL(document.location)
    const emailValue = searchParams.get("email")
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState(emailValue || "");
    const [password, setPassword] = useState("");



    const { signup, isSigningUp } = useAuthStore();


    const handleSignUp = async (event) => {
        event.preventDefault()
        await signup({ email, userName, password })
        setUserName("")
        setEmail("")
        setPassword("")
    }

    return (
        <div className="h-screen hero-bg">
            <img src="/logo.png" alt="Logo" className="w-52 px-2 py-2 ml-40 pt-5" />
            <div className="flex justify-center items-center mt-20 mx-3">
                <div className=" flex flex-col max-w-md bg-black/60 p-8 space-y-6 rounded-lg shadow-md">
                    <h1 className="text-red-600 text-2xl font-bold mb-4">Sign Up</h1>
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <input type="text" placeholder="Full Name"
                            className="w-full px-3 py-2 mt-1 border border-x-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <input type="email" placeholder="example@gmail.com"
                            className="w-full px-3 py-2 mt-1 border border-x-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="password"
                            className="w-full px-3 py-2 mt-1 border border-x-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="w-full bg-red-600 text-white px-3 py-2 font-semibold rounded-md hover:bg-red-700" disabled={isSigningUp}>
                            {isSigningUp ? "Signing Up....." : "Sign Up"}</button>
                    </form>
                    <h1 className="self-center text-white">Already a member?{" "}
                        <Link to="/login" className=" text-red-600 hover:underline">Login</Link></h1>
                </div>
            </div>
        </div>
    )
}

export default SignUp