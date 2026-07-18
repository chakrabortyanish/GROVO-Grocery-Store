import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to, subject, htmlContent) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.FROM_NAME,
          email: process.env.FROM_EMAIL,
        },

        to: [{ email: to }],

        subject,

        htmlContent,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
};

export default sendMail;