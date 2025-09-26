import mongoose from "mongoose"

const connectDb= async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected successfully")

    }
    catch(error){
        console.log("error while connecting to Database ")
    }
}


export default connectDb