import { transporter } from "./email.config.js";

// where the buttons in the emails lead (set CLIENT_URL in .env when you deploy)
const APP_URL = process.env.CLIENT_URL || process.env.CORS_ORIGIN || "http://localhost:3000";

const FONT = "Arial, Helvetica, sans-serif";

// usernames come from users, so make them safe before putting them in HTML
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

// a pink button that works in all email apps (Gmail, Outlook, Apple Mail)
const button = (label, url) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px 0;">
  <tr>
    <td align="center" bgcolor="#db2777" style="border-radius:8px;">
      <a href="${url}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">${label}</a>
    </td>
  </tr>
</table>`;

// one row of the "what you can do" list
const feature = (title, text) => `
<tr>
  <td style="width:28px;vertical-align:top;padding:10px 0;">
    <div style="width:10px;height:10px;margin-top:5px;background-color:#db2777;border-radius:5px;"></div>
  </td>
  <td style="padding:10px 0;font-family:${FONT};font-size:14px;line-height:21px;color:#4b5563;">
    <strong style="color:#111827;">${title}</strong><br>${text}
  </td>
</tr>`;

// the frame shared by every email: dark header, white body, light footer
const layout = ({ preheader, content, footerNote }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backora</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1f3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f1f3;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0b0b0f;border-radius:16px 16px 0 0;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:40px;height:40px;background-color:#db2777;border-radius:10px;text-align:center;vertical-align:middle;font-family:${FONT};font-size:22px;font-weight:bold;color:#ffffff;line-height:40px;">B</td>
                  <td style="padding-left:12px;font-family:${FONT};font-size:24px;font-weight:bold;color:#ffffff;">Backora</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pink line -->
          <tr>
            <td style="height:4px;background-color:#db2777;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 32px;font-family:${FONT};color:#1f2937;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#faf7f9;border-top:1px solid #eeeaec;border-radius:0 0 16px 16px;padding:24px 32px;font-family:${FONT};font-size:12px;line-height:19px;color:#6b7280;text-align:center;">
              ${footerNote}<br>
              This is an automated message, please do not reply to it.<br>
              &copy; ${new Date().getFullYear()} Backora. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;


export const sendWelcomeEmail = async (email, username) => {
    const name = escapeHtml(username);

    const content = `
      <h1 style="margin:0 0 16px 0;font-family:${FONT};font-size:26px;line-height:34px;color:#111827;">Welcome to Backora, ${name}!</h1>

      <p style="margin:0 0 16px 0;font-size:15px;line-height:24px;color:#4b5563;">
        Your account has been created successfully. Backora gives you a ready-to-use backend,
        so you can focus on building your app.
      </p>

      <p style="margin:24px 0 4px 0;font-size:13px;font-weight:bold;letter-spacing:0.5px;color:#db2777;">WHAT YOU CAN DO</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${feature("Create projects", "Set up a new backend for each of your apps in a few clicks.")}
        ${feature("Manage collections", "Use ready-made collections, like users with signup, signin and signout.")}
        ${feature("Use API keys", "Connect your own app securely with an API key.")}
      </table>

      ${button("Open your dashboard", `${APP_URL}/project`)}

      <p style="margin:24px 0 0 0;font-size:14px;line-height:22px;color:#4b5563;">
        Happy building,<br><strong style="color:#111827;">The Backora Team</strong>
      </p>`;

    const text = `Welcome to Backora, ${username}!

Your account has been created successfully.

What you can do:
- Create projects: set up a new backend for each of your apps.
- Manage collections: use ready-made collections like users.
- Use API keys: connect your own app securely.

Open your dashboard: ${APP_URL}/project

Happy building,
The Backora Team`;

    return await transporter.sendMail({
        from: `"Backora Team" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to Backora!",
        text,
        html: layout({
            preheader: "Your Backora account is ready. Create your first project.",
            content,
            footerNote: "You received this email because an account was created with this address.",
        }),
    });
};


// details is optional, for example { ip: "1.2.3.4", device: "Chrome on Windows" }
export const sendLoginEmail = async (email, username, details = {}) => {
    const name = escapeHtml(username);
    const time = new Date().toUTCString().replace("GMT", "UTC");

    const row = (label, value) => `
      <tr>
        <td style="padding:8px 0;font-family:${FONT};font-size:13px;color:#6b7280;width:110px;">${label}</td>
        <td style="padding:8px 0;font-family:${FONT};font-size:14px;color:#111827;font-weight:bold;">${value}</td>
      </tr>`;

    const content = `
      <h1 style="margin:0 0 16px 0;font-family:${FONT};font-size:26px;line-height:34px;color:#111827;">New sign-in to your account</h1>

      <p style="margin:0 0 20px 0;font-size:15px;line-height:24px;color:#4b5563;">
        Hi ${name}, you just signed in to your Backora account. Here are the details:
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f9;border:1px solid #eeeaec;border-radius:10px;">
        <tr>
          <td style="padding:12px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              ${row("Account", escapeHtml(email))}
              ${row("Time", time)}
              ${details.device ? row("Device", escapeHtml(details.device)) : ""}
              ${details.ip ? row("IP address", escapeHtml(details.ip)) : ""}
            </table>
          </td>
        </tr>
      </table>

      ${button("Go to your dashboard", `${APP_URL}/project`)}

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;background-color:#fdf2f8;border-left:4px solid #db2777;border-radius:6px;">
        <tr>
          <td style="padding:14px 18px;font-family:${FONT};font-size:14px;line-height:22px;color:#831843;">
            <strong>Was this not you?</strong><br>
            Change your password right away and sign out of all your devices to keep your account safe.
          </td>
        </tr>
      </table>

      <p style="margin:24px 0 0 0;font-size:14px;line-height:22px;color:#4b5563;">
        Best regards,<br><strong style="color:#111827;">The Backora Team</strong>
      </p>`;

    const text = `Hi ${username},

You just signed in to your Backora account.

Account: ${email}
Time: ${time}${details.device ? `\nDevice: ${details.device}` : ""}${details.ip ? `\nIP address: ${details.ip}` : ""}

Go to your dashboard: ${APP_URL}/project

Was this not you? Change your password right away and sign out of all your devices.

Best regards,
The Backora Team`;

    return await transporter.sendMail({
        from: `"Backora Team" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "New sign-in to your Backora account",
        text,
        html: layout({
            preheader: "We noticed a new sign-in to your Backora account.",
            content,
            footerNote: "You received this email because someone signed in to your Backora account.",
        }),
    });
};