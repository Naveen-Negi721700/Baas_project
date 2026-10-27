
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

    // Don't let a failed connection wait for minutes
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

transporter.verify()
    .then(() => {
        console.log("Email server is ready");
    })
    .catch((error) => {
        console.error(
            "Email setup problem:",
            error.code,
            error.message
        );
    });
