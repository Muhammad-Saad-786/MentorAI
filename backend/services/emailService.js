import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"MentorAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - MentorAI",
    html: `
      <div style="max-width:600px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#FFFFFF;border-radius:16px;border:1px solid #E8D5C4;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:48px;height:48px;border-radius:12px;background:#FF6B35;display:inline-flex;align-items:center;justify-content:center;">
            <span style="color:#FFFFFF;font-size:22px;">✦</span>
          </div>
          <h1 style="color:#1A1A2E;font-size:24px;margin:12px 0 0;">MentorAI</h1>
        </div>
        <h2 style="color:#1A1A2E;text-align:center;">Verify Your Email</h2>
        <p style="color:#5C5C6E;font-size:15px;text-align:center;">Use this code to verify your account:</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="background:#FFF3E8;color:#FF6B35;font-size:32px;font-weight:800;letter-spacing:8px;padding:16px 32px;border-radius:12px;border:2px dashed #FF6B35;display:inline-block;font-family:'Courier New',monospace;">
            ${otp}
          </span>
        </div>
        <p style="color:#8B8B9E;font-size:12px;text-align:center;">This code expires in 10 minutes.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;
  const mailOptions = {
    from: `"MentorAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - MentorAI",
    html: `
      <div style="max-width:600px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;">
        <h1 style="color:#FF6B35;text-align:center;">MentorAI</h1>
        <h2 style="color:#1A1A2E;">Reset Your Password</h2>
        <p style="color:#5C5C6E;">Click below to reset your password. Expires in 1 hour.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${resetUrl}" style="background:#FF6B35;color:#FFFFFF;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;">Reset Password</a>
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
}
