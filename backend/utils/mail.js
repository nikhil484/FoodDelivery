import axios from "axios";

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY,
  },
  timeout: 10000, // 10s safety timeout
});


export const sendOtpMail = async (to, otp) => {
  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        name: "Vingo",
        email: "vingo6731@gmail.com",
      },
      to: [{ email: to }],
      subject: "Reset your Vingo password",
      htmlContent: `
        <div style="font-family: Arial, sans-serif;">
          <p>Your OTP is:</p>
          <h2>${otp}</h2>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Password reset OTP sent to:", to);
  } catch (error) {
    console.error(
      "❌ Brevo sendOtpMail error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        name: "Vingo Delivery",
        email: "vingo6731@gmail.com",
      },
      to: [
        {
          email: user.email,
          name: user.fullName || "Customer",
        },
      ],
      subject: "Delivery OTP - Vingo",
      htmlContent: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Delivery Confirmation</h2>
          <p>Hello ${user.fullName || "Customer"},</p>
          <p>Your delivery OTP is:</p>
          <h1 style="color:#ff4d2d;">${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Delivery OTP sent to:", user.email);
  } catch (error) {
    console.error(
      "❌ Brevo sendDeliveryOtpMail error:",
      error.response?.data || error.message
    );
    throw error;
  }
};













































// import nodemailer from "nodemailer"
// import dotenv from "dotenv"
// dotenv.config()
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS
//   }
// })

// export const sendOtpMail= async(to,otp)=>{
//     await transporter.sendMail({
//         from:process.env.EMAIL,
//         to,
//         subject:"Reset your Vingo Password",
//         html:`<p>Your OTP for password reset is <b>${otp} </b>.It expires
//         in 5 minutes. </p>`


//     }) 
// }
// export const sendDeliveryOtpMail= async(user,otp)=>{
//     await transporter.sendMail({
//         from:process.env.EMAIL,
//         to:user.email,
//         subject:"Delivery OTP",
//         html:`<p>Your OTP for Delivery is <b>${otp} </b>.It expires
//         in 5 minutes. </p>`


//     }) 
// }

