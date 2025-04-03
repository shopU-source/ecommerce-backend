import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

async function sendMail(to, subject, text, html) {
  try {
    // Validate inputs
    if (!to) {
      throw new Error("Recipient email address is required");
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: to, // Ensure it's a string
      subject,
      text: text || "",
      html: html || "",
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending mail: ", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export { sendMail };
