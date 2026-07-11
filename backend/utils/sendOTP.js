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

        subject: "Verify your Grovo account",

        htmlContent: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
        
        <div style="background-color: #4f46e5; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Grovo</h1>
        </div>

        <div style="padding: 32px 32px 24px 32px;">
            <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 600;">Confirm your email address</h2>
            <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">Thank you for choosing Grovo. Use the following One-Time Password (OTP) to complete your verification process. This code is confidential.</p>
            
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px; border: 1px dashed #d1d5db;">
                <span style="display: block; font-size: 12px; text-transform: uppercase; tracking: 0.05em; color: #6b7280; font-weight: 600; margin-bottom: 6px;">Your Verification Code</span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #111827; display: inline-block; padding-left: 6px;">${otp}</span>
            </div>

            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13.5px; color: #b45309;">
                    ⏱️ This code will expire in <strong>1 minute</strong> for your security.
                </p>
            </div>

            <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">
                <strong>Didn't request this?</strong> If you didn't attempt to sign in or register with Grovo, please disregard this email safely. Your account security is intact.
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Grovo Inc. All rights reserved.</p>
        </div>
        
    </div>
</div>
`,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      },
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error("Brevo API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default sendOTP;
