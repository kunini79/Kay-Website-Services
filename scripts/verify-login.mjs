/**
 * Debug script: verify that stored password hashes actually work, fix if broken.
 * Usage: node scripts/verify-login.mjs
 */
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI    = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL || 'https://kaycorp.tech';

const demoUserSchema = new mongoose.Schema(
  {
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String, required: true },
    name:        { type: String, required: true },
    company:     { type: String, required: true },
    approvedAt:  { type: Date, required: true },
    lastLoginAt: Date,
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Mirror the app's pre-save hook exactly
demoUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const DemoUser = mongoose.model('DemoUser', demoUserSchema);

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let pass = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

function buildEmail(name, email, plainPassword, loginUrl) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e5e5;">
      <h1 style="color:#58CC02;font-size:28px;margin-bottom:8px;">Your ThinkBox login details 🔑</h1>
      <p style="font-size:16px;color:#333;">Hi ${name},</p>
      <p style="font-size:15px;color:#555;">Here are your updated login credentials for ThinkBox. Use these to sign in.</p>
      <div style="background:#F7F7F7;border:1px solid #E5E5E5;padding:20px;border-radius:10px;margin:24px 0;">
        <p style="margin:0 0 10px;font-size:14px;"><strong>Email:</strong></p>
        <code style="display:block;background:#fff;border:1px solid #ddd;padding:10px 14px;border-radius:6px;font-size:15px;color:#333;">${email}</code>
        <p style="margin:16px 0 10px;font-size:14px;"><strong>Password:</strong></p>
        <code style="display:block;background:#fff;border:1px solid #ddd;padding:10px 14px;border-radius:6px;font-size:15px;color:#333;">${plainPassword}</code>
        <p style="color:#888;font-size:12px;margin:14px 0 0;">Save these details somewhere secure.</p>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${loginUrl}" style="background-color:#58CC02;color:#fff;padding:14px 36px;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;display:inline-block;box-shadow:0 4px 0 #46A302;">
          Sign In to ThinkBox
        </a>
      </div>
      <p style="font-size:14px;color:#777;">Login URL: <a href="${loginUrl}" style="color:#58CC02;">${loginUrl}</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
      <p style="color:#aaa;font-size:11px;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const users = await DemoUser.find({}).lean();
  console.log(`Found ${users.length} DemoUser(s) in DB.\n`);

  const resend   = new Resend(RESEND_API_KEY);
  const loginUrl = `${APP_URL}/products/thinkbox?tab=login`;

  for (const u of users) {
    console.log(`── ${u.name} <${u.email}>  active=${u.isActive}`);

    // Always reset password via .save() so the pre-save hook hashes it correctly
    const plainPassword = generatePassword();

    // Use findById + set + save so the pre-save hook runs exactly like the app
    const doc = await DemoUser.findById(u._id);
    doc.password = plainPassword;   // plaintext — hook will hash it
    doc.isActive = true;
    await doc.save();               // pre-save hook fires here → stored as bcrypt hash

    // Verify the comparison works before sending
    const fresh = await DemoUser.findById(u._id);
    const ok = await bcryptjs.compare(plainPassword, fresh.password);
    if (!ok) {
      console.error(`   ✗ Hash verification FAILED for ${u.email} — skipping email`);
      continue;
    }
    console.log(`   ✓ Hash verified OK`);

    // Send the email
    const result = await resend.emails.send({
      from:    'ThinkBox <noreply@kaycorp.tech>',
      to:      u.email,
      subject: 'Your ThinkBox login credentials (updated)',
      html:    buildEmail(u.name, u.email, plainPassword, loginUrl),
    });

    if (result.error) {
      console.error(`   ✗ Email failed: ${JSON.stringify(result.error)}`);
    } else {
      console.log(`   ✓ Email sent (ID: ${result.data?.id})  password: ${plainPassword}`);
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('\nDone.');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
