import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from './components/Store/authUser'
import { Loader } from 'lucide-react'
import { WatchPage } from './components/Watchpage'
import SearchPage from './components/SearchPage'
import { HistoryPage } from './components/HistoryPage'
import { NotFoundPage } from './components/404Page'
import { SubscriptionPage } from './components/Subscription'




function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();
  // console.log("auth user is here:", user)

  useEffect(() => {
    authCheck();
  }, [authCheck])

  if (isCheckingAuth) {
    return (
      <div className='h-screen'>
        <div className='flex justify-center items-center bg-black h-full'>
          <Loader className='animate-spin text-red-600 size-10' />
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signUp" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route exact path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route exact path="/watch/:id" element={user ? <WatchPage /> : <Navigate to="/login" />} />
        <Route exact path="/search" element={user ? < SearchPage /> : <Navigate to="/login" />} />
        <Route exact path="/history" element={user ? <HistoryPage /> : <Navigate to="/login" />} />
        <Route exact path="/subscribe" element={user ? <SubscriptionPage /> : <Navigate to="/login" />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
