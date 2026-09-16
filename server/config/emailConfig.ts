import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Configuration Error:", error);
  } else {
    console.log("SMTP is configured properly and ready to send emails.");
  }
});

const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"MYSMME" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (
  to: string,
  token: string,
  name: string,
) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email/${token}`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333333;
        }
        .message {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #4f46e5;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="message">
          <p>Hi ${name},</p>
          <p>Thanks for registering with <strong>MYSMME</strong>. Please click the button below to verify your email address and complete your registration.</p>
          <a href="${verificationUrl}" class="btn">Verify Email</a>
          <p>If you did not create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MySSME. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail(to, "Please verify your account", html);
};

export const sendPasswordResetEmail = async (
  to: string,
  token: string,
  name: string,
) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${token}`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333333;
        }
        .message {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #d63384;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="message">
          <p>Hi ${name},</p>
          <p>You recently requested to reset your password for your <strong>MYSMME</strong> account. Click the button below to proceed:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p>This password reset link is only valid for a limited time. If you didn’t request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MySSME. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail(to, "Please reset your account password", html);
};

export const sendSellerWelcomeEmail = async (to: string, name: string) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/login`;
  const forgotPasswordUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/forgot-password`;

  const year = new Date().getFullYear();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />

      <title>Welcome to MYSMME</title>

      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
          color: #333333;
        }

        .wrapper {
          width: 100%;
          padding: 40px 15px;
          box-sizing: border-box;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        }

        .header {
          background-color: #4f46e5;
          padding: 30px;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
        }

        .content {
          padding: 35px 30px;
        }

        .message {
          font-size: 16px;
          color: #444444;
          line-height: 1.7;
        }

        .account-box {
          margin: 30px 0;
          padding: 22px;
          background-color: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .account-box h2 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #222222;
        }

        .account-item {
          margin-bottom: 15px;
        }

        .account-item:last-child {
          margin-bottom: 0;
        }

        .label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .value {
          display: block;
          padding: 10px 12px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          color: #111827;
          font-size: 14px;
          word-break: break-word;
        }

        .btn-container {
          text-align: center;
          margin: 30px 0;
        }

        .btn {
          display: inline-block;
          padding: 13px 25px;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff !important;
          background-color: #4f46e5;
          text-decoration: none;
          border-radius: 6px;
        }

        .warning {
          margin: 25px 0;
          padding: 15px 18px;
          background-color: #fff7ed;
          border-left: 4px solid #f97316;
          border-radius: 5px;
        }

        .warning p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #9a3412;
        }

        .footer {
          padding: 25px 30px;
          background-color: #f8fafc;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #999999;
          line-height: 1.6;
        }

        @media only screen and (max-width: 600px) {
          .wrapper {
            padding: 20px 10px;
          }

          .content {
            padding: 25px 20px;
          }

          .header {
            padding: 25px 20px;
          }

          .header h1 {
            font-size: 22px;
          }
        }
      </style>
    </head>

    <body>

      <div class="wrapper">

        <div class="container">

          <div class="header">
            <h1>Welcome to MYSMME 🎉</h1>
          </div>

          <div class="content">

            <div class="message">

              <p>Hi <strong>${name}</strong>,</p>

              <p>
                Welcome to <strong>MYSMME</strong>!
                Your seller account has been successfully created.
              </p>

              <p>
                Your account is ready to use. You can access your
                seller account to manage your products, orders,
                and seller profile.
              </p>

            </div>

            <div class="account-box">

              <h2>Your Seller Account</h2>

              <div class="account-item">
                <span class="label">Name</span>
                <span class="value">${name}</span>
              </div>

              <div class="account-item">
                <span class="label">Email</span>
                <span class="value">${to}</span>
              </div>

            </div>

            <div class="warning">

              <p>
                <strong>Set your password:</strong>
                For security reasons, a password has not been sent
                by email. Please use the "Forgot Password" option
                to securely create your password.
              </p>

            </div>

            <div class="btn-container">

              <a
                href="${forgotPasswordUrl}"
                class="btn"
              >
                Set Your Password
              </a>

            </div>

            <div class="message">

              <p>
                After setting your password, you can log in using
                your email address and newly created password.
              </p>

              <p>
                <a href="${loginUrl}">
                  Go to MYSMME Login
                </a>
              </p>

              <p>
                If you have any questions or need assistance,
                please contact our support team.
              </p>

              <p>
                Best regards,<br />
                <strong>MYSMME Team</strong>
              </p>

            </div>

          </div>

          <div class="footer">
            &copy; ${year} MYSMME. All rights reserved.
            <br />
            This email was sent because a seller account was
            created using this email address.
          </div>

        </div>

      </div>

    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"MYSMME" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to MYSMME - Your Seller Account Is Ready",
      html,
    });

    return info;
  } catch (error) {
    throw error;
  }
};
