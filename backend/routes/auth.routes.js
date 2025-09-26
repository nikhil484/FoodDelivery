import express from "express"
import { signIn, signOut, signUP } from "../controllers/auth.controllers.js"

const authRouter= express.Router()

authRouter.post("/signup",signUP)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)

export default authRouter