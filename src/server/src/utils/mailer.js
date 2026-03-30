const nodemailer = require('nodemailer');
const env = require('../config/env');

// Reuse a single transporter instance for the process lifetime.
// Using SMTP pool=true is intentional: avoids reconnect overhead on every OTP send.
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for port 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Send a one-time password to a user's email address.
 * Never logs the OTP value — only the recipient address.
 *
 * @param {string} toEmail
 * @param {string} otp  6-digit string
 */
async function sendOtpEmail(toEmail, otp) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #1a73e8;">VNS Travel — Verification Code</h2>
      <p>Use the code below to continue. It expires in <strong>10 minutes</strong>.</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px;
                  background: #f4f4f4; padding: 16px 24px; border-radius: 8px;
                  display: inline-block;">${otp}</div>
      <p style="color: #666; font-size: 13px; margin-top: 24px;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: toEmail,
    subject: 'VNS - Your verification code',
    text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
    html,
  });

  // Log recipient only — logging the OTP would be a security risk
  console.log(`[Mailer] OTP email sent to ${toEmail}`);
}

module.exports = { sendOtpEmail };
