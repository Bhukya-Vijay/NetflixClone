import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "./Store/authUser";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, isLoggingIn } = useAuthStore();

    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault()
        const success = await login({ email, password })
        if (success) {
            navigate("/")
        }
    }

    return (
        <div className="h-screen hero-bg">
            <img src="/logo.png" alt="Logo" className="w-52 px-2 py-2" />
            <div className="flex justify-center items-center mt-20 mx-3">
                <div className=" flex flex-col max-w-md bg-black/60 p-8 space-y-6 rounded-lg shadow-md">
                    <h1 className="text-red-600 text-2xl font-bold mb-4">LogIn</h1>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <input type="email" placeholder="example@gmail.com"
                            className="w-full px-3 py-2 mt-1 border border-x-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="password"
                            className="w-full px-3 py-2 mt-1 border border-x-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="w-full bg-red-600 text-white px-3 py-2 font-semibold rounded-md hover:bg-red-700" disabled={isLoggingIn}>
                            {isLoggingIn ? "Loading...." : "Login"}</button>
                    </form>
                    <h1 className="self-center text-white">Don't have an account?{" "}
                        <Link to="/signUp" className=" text-red-600 hover:underline">SignUp</Link></h1>
                </div>
            </div>
        </div>
    )
}

export default Login