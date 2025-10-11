import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SignUP from './pages/signup.jsx'
import SignIn from './pages/SignIn.Jsx'
export const serverUrl= "http://localhost:8000"

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUP/>}/>
      <Route path='/signIn' element={<SignIn/>}/>
    </Routes>
  )
}

export default App
