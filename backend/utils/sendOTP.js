import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendOTP = async (email, otp) => {

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Grovo Email Verification",

        html: `
            <h2>Email Verification</h2>

            <p>Your OTP is</p>

            <h1>${otp}</h1>

            <p>This OTP expires in 1 minutes.</p>
        `
    });

};

export default sendOTP;