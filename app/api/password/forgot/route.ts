import { NextRequest, NextResponse } from 'next/server';
import { DemoUser } from '@/lib/models/DemoUser';
import { dbConnect } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function buildResetEmail(token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e5e5;">
      <h1 style="color:#333;font-size:24px;">Password Reset Request</h1>
      <p style="font-size:16px;color:#555;">You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
      <p style="font-size:16px;color:#555;">Please click on the button below, or paste this link into your browser to complete the process:</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${resetUrl}" style="background-color:#007bff;color:#fff;padding:14px 24px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">Reset Your Password</a>
      </div>
      <p style="font-size:16px;color:#555;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p style="font-size:14px;color:#888;">This link will expire in 1 hour.</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await DemoUser.findOne({ email });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    try {
      await resend.emails.send({
        from: 'ThinkBox Password Reset <noreply@kaycorp.tech>',
        to: user.email,
        subject: 'ThinkBox Password Reset',
        html: buildResetEmail(resetToken),
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return NextResponse.json({ message: 'Error sending password reset email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
