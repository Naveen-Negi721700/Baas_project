import nodemailer from "nodemailer";

// SMTP settings come from the .env file
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // port 587 upgrades the connection with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// optional: tells you when the server starts if the email settings are wrong
transporter.verify((error) => {
    if (error) {
        console.error("Email setup problem:", error.message);
    } else {
        console.log("Email server is ready");
    }
});