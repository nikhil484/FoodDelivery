import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
const app=express()
const port = process.env.PORT||5000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
    
}))
//this is global middleware which converts all the data coming from frontend to json format otherwise it will be called invalid 
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


app.listen(port,()=>{
    connectDb()
    console.log(`sever started at ${port}`)
})