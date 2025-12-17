import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN, 
    pass: process.env.BREVO_SMTP_KEY 
  }
});

export const sendOtpMail = async (to, otp) => {
    try {
        await transporter.sendMail({
            //from: '"Vingo" <vingo6731@gmail.com>', 
            from: `"Vingo" <${process.env.BREVO_LOGIN}>`,
            to,
            subject: "Reset your Vingo Password",
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });
        console.log("✅ Password reset email sent to:", to);
    } catch (error) {
        console.error("❌ Email error:", error);
        throw error;
    }
}

export const sendDeliveryOtpMail = async (user, otp) => {
    try {
        await transporter.sendMail({
           // from: '"Vingo Delivery" <vingo6731@gmail.com>',
           from: `"Vingo" <${process.env.BREVO_LOGIN}>` ,
           to: user.email,
            subject: "Delivery OTP - Vingo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Delivery Confirmation</h2>
                    <p>Hello ${user.fullName},</p>
                    <p>Your delivery OTP is: <strong style="font-size: 24px; color: #ff4d2d;">${otp}</strong></p>
                    <p>This OTP expires in 5 minutes.</p>
                    <p>Share this with your delivery person to confirm delivery.</p>
                </div>
            `
        });
        console.log("✅ Delivery OTP email sent to:", user.email);
    } catch (error) {
        console.error("❌ Email error:", error);
        throw error;
    }
}












































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

