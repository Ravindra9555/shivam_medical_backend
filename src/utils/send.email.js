import nodemailer from "nodemailer";
import { AsyncHandler } from "./AsyncHandler.js";

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_PORT === '465', // true for port 465, false for other ports
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

const sendMail = AsyncHandler(async (name, message, phone, email) => {
  try {
    const info = await transporter.sendMail({
      from: `"Shivam Medical" <${process.env.MAILER_EMAIL}>`, // Use your environment variables
      to: "ravindraietbu@gmail.com", // Example recipient, could be dynamic
      subject: `New Contact from ${name}`,
      text: `Contact from,
             Name: ${name}, 
             Phone: ${phone}, 
             Email: ${email}, 
             Message: ${message}`,
    });

    console.log("Message sent: %s", info.messageId); // Optional: log for debugging
  } catch (error) {
    console.error(`Error sending mail: ${error.message}`);
  }
});

 const sendResetLink = AsyncHandler(async(email, resetLink)=>{
  try {

    const info = await transporter.sendMail({
      from: `"Shivam Medical" <${process.env.MAILER_EMAIL}>`, // Use your environment variables
      to:  email, // Example recipient, could be dynamic
      subject: `Password Reset for ${email}`,
      html: `
            <h1>Password Reset</h1>
            <p>Click on the following link to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>Shivam Medical</p>
            <p>We are here to help you find the best care for your health.</p>
            <p>Thank you!</p>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    
  } catch (error) {
    console.error(`Error sending mail: ${error.message}`);  
  }
 })
export { sendMail, sendResetLink };
