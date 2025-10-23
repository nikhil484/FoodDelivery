import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SignUP from './pages/signup.jsx'
import SignIn from './pages/SignIn.Jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
export const serverUrl= "http://localhost:8000"

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUP/>}/>
      <Route path='/signIn' element={<SignIn/>}/>
     <Route path='/forgotPassword' element={<ForgotPassword/>}/>
    </Routes>
  )
}

export default App
