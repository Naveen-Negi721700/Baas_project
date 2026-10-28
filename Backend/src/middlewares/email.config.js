import nodemailer from "nodemailer";

// SMTP settings come from the .env file.
// This is only used when BREVO_API_KEY is NOT set (for example on your own computer).
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

    // the default is 2 minutes, so a blocked port made every login and signup wait that long
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
});

// optional check when the server starts (skipped when the HTTPS email API is used)
if (!process.env.BREVO_API_KEY) {
    transporter.verify((error) => {
        if (error) {
            console.error("Email setup problem:", error.message);
        } else {
            console.log("Email server is ready");
        }
    });
}