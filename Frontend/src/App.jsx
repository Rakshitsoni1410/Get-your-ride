import React, { useContext } from 'react'
import { Route ,Routes} from 'react-router-dom'
import Home from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import Captainsignup from './pages/Captainsignup'
import { UserDataContext } from './context/userContext'
import Start from './pages/Start'

const App = () => {

  return (
    <div >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<Captainsignup />} />
        </Routes>
    </div>
  )
}

export default App