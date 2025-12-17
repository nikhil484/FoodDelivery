import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/items.route.js";
import orderRouter from "./routes/order.routes.js";


const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin:"https://vingo-tau.vercel.app",
   // origin:"http://localhost:5173",
    credentials: true
  })
)

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

app.listen(port,()=>{
  connectDb()
  console.log(`server started at ${port}`)
})

