import { LogOut, Menu, Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "./Store/authUser"
import { useContentStore } from "./Store/content"

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const { user, logout } = useAuthStore()
    const { setContentType } = useContentStore();
    const navigate = useNavigate()
    // console.log("home page check", user)

    const handleSubscribe = () => {
        navigate("/subscribe")
    }


    return (
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
            <div className="flex items-center gap-10 z-50">
                <Link to="/">
                    <img src="/logo.png" alt="Netflix Logo" className="w-32 sm:w-40" />
                </Link>
                <div className="hidden sm:flex gap-2 items-center">
                    <Link to="/" className="hover:underline" onClick={() => setContentType("movie")}>Movies</Link>
                    <Link to="/" className="hover:underline" onClick={() => setContentType("tv")}>TV Shows</Link>
                    <Link to="/history" className="hover:underline">Search History</Link>
                </div>
            </div>

            <div className="flex gap-2 items-center z-50">
                <Link to={"/search"}>
                    <Search className="size-6 cursor-pointer" />
                </Link>
                <div className="relative inline-block">
                    <img src={user.image} alt="Avatar" className="h-8 roudnded cursor-pointer" />
                    <div className="username w-fit absolute left-0 right-0 top-full mt-2 bg-gray-800 text-white text-lg p-2 rounded opacity-0 hover:opacity-100 transition-opacity">{user.username}</div>
                </div>

                <LogOut className="size-6 cursor-pointer" onClick={logout} />
                {!user.isSubscribed && <button className="bg-red-600 size-fit p-2 rounded-sm" onClick={handleSubscribe}>Subscribe</button>}
                <div className="sm:hidden">
                    <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
                </div>
            </div>

            {/* mobile nav bar items*/}

            {isMobileMenuOpen && (
                <div className="w-full sm-hidden mt-4 z-50 bg-black rounded border-gray-800">
                    <Link to="/" className="block hover:underline p-2" onClick={toggleMobileMenu}>
                        Movies
                    </Link>
                    <Link to="/" className="block hover:underline p-2" onClick={toggleMobileMenu}>
                        TV Shows
                    </Link>
                    <Link to="/history" className="block hover:underline p-2" onClick={toggleMobileMenu}>
                        Search History
                    </Link>
                </div>
            )}

        </div>
    )
}

export default Navbar