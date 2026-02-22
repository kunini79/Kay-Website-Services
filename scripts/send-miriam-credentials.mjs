import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { DemoRequest } from '../lib/models/DemoRequest.js';
import { DemoUser } from '../lib/models/DemoUser.js';
import { connectDB } from '../lib/db';

dotenv.config({ path: '../.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kaycorp.tech';

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let pass = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

function buildCredentialsEmail(name, email, plainPassword, loginUrl) {
  return `\n    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e5e5;">\n      <h1 style="color:#58CC02;font-size:28px;margin-bottom:8px;">You're in! Welcome to ThinkBox 🎉</h1>\n      <p style="font-size:16px;color:#333;">Hi ${name},</p>\n      <p style="font-size:15px;color:#555;">Your beta tester request has been approved. Below are your login credentials — keep them safe.</p>\n\n      <div style="background:#F7F7F7;border:1px solid #E5E5E5;padding:20px;border-radius:10px;margin:24px 0;">\n        <p style="margin:0 0 10px;font-size:14px;"><strong>Email:</strong></p>\n        <code style="display:block;background:#fff;border:1px solid #ddd;padding:10px 14px;border-radius:6px;font-size:15px;color:#333;">${email}</code>\n\n        <p style="margin:16px 0 10px;font-size:14px;"><strong>Password:</strong></p>\n        <code style="display:block;background:#fff;border:1px solid #ddd;padding:10px 14px;border-radius:6px;font-size:15px;color:#333;">${plainPassword}</code>\n\n        <p style="color:#888;font-size:12px;margin:14px 0 0;">Save these details somewhere secure.</p>\n      </div>\n\n      <div style="text-align:center;margin:28px 0;">\n        <a href="${loginUrl}" style="background-color:#58CC02;color:#fff;padding:14px 36px;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;display:inline-block;box-shadow:0 4px 0 #46A302;">\n          Sign In to ThinkBox\n        </a>\n      </div>\n\n      <h3 style="font-size:16px;color:#333;">How to get started:</h3>\n      <ol style="color:#555;font-size:14px;line-height:1.8;">\n        <li>Click the button above or go to <a href="${loginUrl}" style="color:#58CC02;">${loginUrl}</a></li>\n        <li>Enter your email and the password above</li>\n        <li>Start exploring hundreds of topics across 9 categories — fully offline</li>\n      </ol>\n\n      <p style="font-size:15px;color:#333;margin-top:24px;">Happy exploring!<br><strong>The ThinkBox Team</strong></p>\n\n      <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">\n      <p style="color:#aaa;font-size:11px;">This is an automated message. Please do not reply directly to this email.</p>\n    </div>\n  `;
}

async function processMiriam() {
  await connectDB();

  let req = await DemoRequest.findOne({ $or: [
    { email: /miriam/i },
    { name: /miriam/i }
  ] });

  if (!req) {
    throw new Error('No DemoRequest found for Miriam');
  }

  if (req.status !== 'approved') {
    req.status = 'approved';
    req.approvedAt = new Date();
    await req.save();
  }

  const plainPassword = generatePassword();

  let user = await DemoUser.findOne({ email: req.email });
  if (user) {
    user.name = req.name || req.email;
    user.company = req.company || 'N/A';
    user.isActive = true;
    user.approvedAt = req.approvedAt || new Date();
    user.password = plainPassword;
    await user.save();
  } else {
    await DemoUser.create({
      email: req.email,
      password: plainPassword,
      name: req.name || req.email,
      company: req.company || 'N/A',
      approvedAt: req.approvedAt || new Date(),
      isActive: true,
    });
  }

  const resend = new Resend(RESEND_API_KEY);
  const loginUrl = `${APP_URL}/products/thinkbox?tab=login`;
  const result = await resend.emails.send({
    from: 'ThinkBox <noreply@kaycorp.tech>',
    to: req.email,
    subject: 'Your ThinkBox Beta Access is Approved!',
    html: buildCredentialsEmail(req.name, req.email, plainPassword, loginUrl),
  });

  if (result.error) throw new Error(JSON.stringify(result.error));

  return {
    email: req.email,
    password: plainPassword,
    sent: true,
    id: result.data?.id,
  };
}

processMiriam()
  .then((res) => {
    console.log('Miriam credentials sent:', res);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
