import { useAuthStore } from "../Store/authUser"
import AuthScreen from "./AuthScreen"
import HomeScreen from "./HomeScreen"

const Home = () => {
    const { user } = useAuthStore();
    // console.log({ "home user: ": user })

    return (
        <div>
            {user ? <HomeScreen /> : <AuthScreen />}
        </div>
    )
}

export default Home