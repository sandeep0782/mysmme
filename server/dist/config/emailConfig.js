"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Configuration Error:", error);
    }
    else {
        console.log("SMTP is configured properly and ready to send emails.");
    }
});
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `"MYSMME" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
});
const sendVerificationEmail = (to, token, name) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield sendEmail(to, "Please verify your account", html);
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = (to, token, name) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield sendEmail(to, "Please reset your account password", html);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
