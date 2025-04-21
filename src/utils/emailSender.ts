import nodemailer from "nodemailer";
import config from "../config";

export const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // this is gmail host.[search it on google]
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      user: config.EMAIL_HOST,
      pass: config.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"PH-HealthCare" <sajjadsajjad098765@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset Password Link", // Subject line
    text: "Reset Password", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
