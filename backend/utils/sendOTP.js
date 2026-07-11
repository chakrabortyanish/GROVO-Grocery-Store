import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // for port 587
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `Grovo <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Grovo Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2 style="color:#2E7D32;">Welcome to Grovo</h2>

          <p>Hello,</p>

          <p>Your email verification OTP is:</p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            color:#2E7D32;
            text-align:center;
            margin:20px 0;
          ">
            ${otp}
          </div>

          <p>This OTP is valid for <strong>1 minute</strong>.</p>

          <p>If you didn't request this OTP, please ignore this email.</p>

          <hr>

          <p style="font-size:12px;color:gray;">
            © ${new Date().getFullYear()} Grovo Grocery Store
          </p>
        </div>
      `,
    });

    // console.log("✅ OTP email sent successfully.");
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    throw error;
  }
};

export default sendOTP;