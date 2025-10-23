import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"


export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobileNumber, role } = req.body
      let user = await User.findOne({ email })
        if (user) {
            return res
                .status(400)
                .json({ message: "user already exists" })
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "password must be of atleast 6 characters " })
        }

        if (mobileNumber.length < 10) {
            return res
                .status(400)
                .json({ message: "Mobile number must be of 10 digits " })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            fullName,
            email,
            role,
            mobileNumber,
            password: hashedPassword
        })
        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true

        })


        return res
            .status(201)
            .json(user)


    }
    catch (error) {
        return res
            .status(500)
            .json(`sign up error ${error}`)

    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({ email })
        if (! user) {
            return res
                .status(400)
                .json({ message: "user doesn't exist" })
        }       

        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res
            .status(401)
            .json({message:"Incorrect password"})
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true

        })


        return res
            .status(200)
            .json(user)


    }
    catch (error) {
        return res
            .status(500)
            .json(`sign In error ${error}`)

    }
}

export const signOut= async(req,res)=>{
    try{
      res.clearCookie("token")
      return res
      .status(200)
      .json({message:"logged out successfully"})

    }
    catch(error){
        return res
        .status(500)
        .json(`signout error ${error}`)

    }
}

export const sendOtp= async(req,res)=>{
    try{
    const{email}=req.body
    const user= await User.findOne({email})
    if(!user){
      return res
      .status(400)
      .json({message:"User doesn't exist"})

    }
    const otp= Math.floor(1000+ Math.random()*9000).toString()
    user.resetOtp=otp
    user.otpExpires=Date.now()+5*60*1000
    user.isOtpVerified=false
    await user.save()
    await sendOtpMail(email,otp)
    return res
    .status(200)
    .json({message:"Otp sent successfully"})
    }catch(error){
    return res
    .status(500)
    .json(`send otp error ${error}`)
    }
}


export const verifyOtp= async(req,res)=>{
    try{
        const{email,otp}=req.body
        const user= await User.findOne({email})
        if(!user || user.resetOtp!= otp || user.otpExpires<Date.now())
        {
            return res
            .status(400)
            .json({message:"Invalid or expired otp"})
        }
        user.isOtpVerified=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res
        .status(200)
        .json({message:"otp verified successfully"})
    }catch(error){
     return res
     .status(500)
     .json(`verify otp error ${error}`)
    }

}

export const resetPassword= async(req,res)=>{
    try{
const {email,newPassword}=req.body
const user= await User.findOne({email})
if(!user || !user.isOtpVerified){
    return res
    .status(400)
    .json({message:"Otp verification required"})
}

const hashedPassword= await bcrypt.hash(newPassword,10)
user.password=hashedPassword
user.isOtpVerified=false
await user.save()
return res
.status(200)
.json({message:"Password reset successfully"})

    }
    catch(error){
        return res
        .status(500)
        .json(`reset password error ${error}`)

    }
}
