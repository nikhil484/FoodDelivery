// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

// import connectDb from "./config/db.js";
// import cookieParser from "cookie-parser";
// import authRouter from "./routes/auth.routes.js";
// import cors from "cors";
// import userRouter from "./routes/user.routes.js";
// import shopRouter from "./routes/shop.routes.js";
// import itemRouter from "./routes/items.route.js";
// import orderRouter from "./routes/order.routes.js";




// const app = express();
// const port = process.env.PORT || 5000;
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   })
// )

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/shop", shopRouter);
// app.use("/api/item", itemRouter);
// app.use("/api/order", orderRouter);

// app.listen(port,()=>{
//   connectDb()
//   console.log(`server started at ${port}`)
// })

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

// CORS configuration - MUST come before routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173",
      "https://vingo-tau.vercel.app"
    ];
    
    // Check if origin is allowed OR is a Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // This is critical for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']  // ✅ Add this to expose cookies
}));

// Body parser and cookie parser
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  connectDb();
  console.log(`server started at ${port}`);
})