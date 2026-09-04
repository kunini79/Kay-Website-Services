/**
 * Bulk script: reset password and send login credentials to ALL approved demo requests.
 * Usage: node scripts/resend-credentials.mjs
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

if (!MONGODB_URI || !RESEND_API_KEY) {
  console.error('Missing MONGODB_URI or RESEND_API_KEY in .env.local');
  process.exit(1);
}

// ─── Password generator ───────────────────────────────────────────────────────
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let pass = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const demoRequestSchema = new mongoose.Schema(
  {
    name:       { type: String },
    email:      { type: String, lowercase: true },
    company:    { type: String },
    phone:      { type: String },
    role:       { type: String },
    useCase:    { type: String },
    message:    { type: String },
    status:     { type: String },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

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

// Mirror the app's pre-save hook exactly so the hash is stored the same way
demoUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const DemoRequest = mongoose.models?.DemoRequest || mongoose.model('DemoRequest', demoRequestSchema);
const DemoUser    = mongoose.models?.DemoUser    || mongoose.model('DemoUser',    demoUserSchema);

// ─── Email builder ────────────────────────────────────────────────────────────
function buildCredentialsEmail(name, email, plainPassword, loginUrl) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e5e5;">
      <h1 style="color:#58CC02;font-size:28px;margin-bottom:8px;">You're in! Welcome to ThinkBox 🎉</h1>
      <p style="font-size:16px;color:#333;">Hi ${name},</p>
      <p style="font-size:15px;color:#555;">Your ThinkBox access is ready. Below are your login credentials — keep them safe.</p>

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

      <h3 style="font-size:16px;color:#333;">How to get started:</h3>
      <ol style="color:#555;font-size:14px;line-height:1.8;">
        <li>Click the button above or go to <a href="${loginUrl}" style="color:#58CC02;">${loginUrl}</a></li>
        <li>Enter your email and the password above</li>
        <li>Start exploring hundreds of topics across 9 categories — fully offline</li>
      </ol>

      <p style="font-size:15px;color:#333;margin-top:24px;">Happy exploring!<br><strong>The ThinkBox Team</strong></p>

      <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
      <p style="color:#aaa;font-size:11px;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  `;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  // Support --id <requestId> and --approve
  const args = process.argv.slice(2);
  let requestId = null;
  let approveFlag = false;
  for (const arg of args) {
    if (arg.startsWith('--id')) {
      requestId = arg.split('=')[1] || args[args.indexOf(arg) + 1];
    }
    if (arg === '--approve') approveFlag = true;
  }

  let requests = [];
  if (requestId) {
    let req = await DemoRequest.findById(requestId);
    if (!req) {
      console.log('No DemoRequest found for ID:', requestId);
      await mongoose.disconnect();
      return;
    }
    if (approveFlag && req.status !== 'approved') {
      req.status = 'approved';
      req.approvedAt = new Date();
      await req.save();
      console.log(`Approved DemoRequest for ${req.name} <${req.email}>`);
    }
    requests = [req.toObject()];
  } else {
    requests = await DemoRequest.find({ status: 'approved' }).lean();
  }
  console.log(`Found ${requests.length} demo request(s) to process.\n`);

  if (requests.length === 0) {
    console.log('Nothing to do.');
    await mongoose.disconnect();
    return;
  }

  const resend   = new Resend(RESEND_API_KEY);
  const loginUrl = `${APP_URL}/products/thinkbox?tab=login`;

  let succeeded = 0;
  let failed    = 0;

  for (const req of requests) {
    const { name, email, company } = req;
    console.log(`── Processing: ${name} <${email}>`);

    try {
      // Generate a fresh plain-text password
      const plainPassword = generatePassword();

      // Find or create the DemoUser, then set plaintext password and .save()
      // so the pre-save hook hashes it exactly as the app expects
      let doc = await DemoUser.findOne({ email });
      if (doc) {
        doc.name       = name || email;
        doc.company    = company || 'N/A';
        doc.isActive   = true;
        doc.approvedAt = req.approvedAt || new Date();
        doc.password   = plainPassword; // hook will hash on save
        await doc.save();
      } else {
        await DemoUser.create({
          email,
          password:   plainPassword, // hook will hash on save
          name:       name || email,
          company:    company || 'N/A',
          approvedAt: req.approvedAt || new Date(),
          isActive:   true,
        });
      }

      // Send the credentials email
      const result = await resend.emails.send({
        from:    'ThinkBox <noreply@kaycorp.tech>',
        to:      email,
        subject: 'Your ThinkBox Beta Access is Approved!',
        html:    buildCredentialsEmail(name, email, plainPassword, loginUrl),
      });

      if (result.error) throw new Error(JSON.stringify(result.error));

      console.log(`   ✅ Sent (ID: ${result.data?.id})  password: ${plainPassword}`);
      succeeded++;
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      failed++;
    }

    // 600 ms delay to stay within Resend's rate limits
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\n── Summary: ${succeeded} sent, ${failed} failed out of ${requests.length} total.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
