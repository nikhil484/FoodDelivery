import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SignUP from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
import { useSelector } from 'react-redux'
import Nav from './components/Nav.jsx'


export const serverUrl= "http://localhost:8000"


function App() {
  useGetCurrentUser()
  const {userData}= useSelector(state=>state.user)
  return (
    <>
    <Nav/>
    <Routes>
    <Route path='/signup' element={!userData?<SignUP/>:<Navigate to={"/"}/>}/>
    <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
    <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
    <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
    </Routes>
    </>
  )
}

export default App
