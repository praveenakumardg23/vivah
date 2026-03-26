import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  await transporter.sendMail({
    to,
    subject: "Your Vivah OTP",
    html: `<h2>Your OTP is: ${otp}</h2>`,
  });
};
