import React from 'react'
import { useState } from 'react'
import { FaRegEye } from "react-icons/fa"
import { FaRegEyeSlash } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const navigate= useNavigate()
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const [showPassword, setShowPassword] = useState(false)
 
  const handleSignIn= async()=>{
    try{
      const result= await axios.post(`${serverUrl}/api/auth/signin`,{
        email,password
      },{withCredentials:true})
      console.log(result)
    }
    catch(error){
     console.log(error)
    }
  }
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4  bg-[#fff9f6]'>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `}
        style={{
          border: `1px solid ${borderColor}`
        }}>
        <h1 className={`text-3xl font-bold mb-2`} style={{ color: primaryColor }}>Vingo</h1>
        <p className='text-gray-600 mb-8'>Sign In to your account to get started with delicious food deliveries </p>

  
        {/* email */}
        <div className='mb-4'>
          <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none 
         ' placeholder="Enter your email" style={{ border: `1px solid ${borderColor}` }}
          onChange={(e)=>setEmail(e.target.value)} value={email} />
        </div>

 

        {/* Password */}
        <div className='mb-4'>
          <label htmlFor="Password" className='block text-gray-700 font-medium mb-1'>Password </label>
          <div className='relative'>
            <input type={`${showPassword ? "text" : "password"}`} className='w-full border rounded-lg px-3 py-2 focus:outline-none
         ' placeholder=" Enter your Password" style={{ border: `1px solid ${borderColor}` }} 
          onChange={(e)=>setPassword(e.target.value)} value={password}/>

            <button className='absolute right-3 top-[14px] text-gray-500 cursor-pointer'
              onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
          </div>
        </div>


        {/* Signup button */}
        <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
         onClick={handleSignIn}>
          Sign In
        </button>
        
        {/* signup with google */}
        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-2 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer'>
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        <p className='text-center mt-4 cursor-pointer' onClick={()=>navigate("/signup")}>
           Want to create a new account ? <span className='text-[#ff4d2d]'>Sign Up</span></p>
      </div>
    </div>
  )
}

export default SignIn


