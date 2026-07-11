import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const sendOTP = async (email, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.FROM_NAME,
          email: process.env.FROM_EMAIL,
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "Grovo Email Verification",

        htmlContent: `
        <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>Grovo Email Verification</h2>

            <p>Your OTP is:</p>

            <h1 style="letter-spacing:5px">${otp}</h1>

            <p>This OTP will expire in <strong>1 minute</strong>.</p>

            <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error(
      "Brevo API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default sendOTP;