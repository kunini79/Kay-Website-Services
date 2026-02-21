import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';
import { DemoUser } from '@/lib/models/DemoUser';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Basic admin authentication
function verifyAdminAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const password = authHeader.replace('Bearer ', '');
  return password === adminPassword;
}

function generatePassword(length: number = 12): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

export async function POST(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { demoRequestId, action } = body;

    if (!demoRequestId || !action) {
      return NextResponse.json(
        { message: 'demoRequestId and action are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const demoRequest = await DemoRequest.findById(demoRequestId);

    if (!demoRequest) {
      return NextResponse.json(
        { message: 'Demo request not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Check if user already exists
      let demoUser = await DemoUser.findOne({ email: demoRequest.email });

      // Track the plain-text password so we can include it in the approval email.
      // After DemoUser.create() the model's pre-save hook bcrypt-hashes the
      // password, so demoUser.password would be the hash — not what we want.
      let plainPassword: string | null = null;

      if (!demoUser) {
        // Generate password
        plainPassword = generatePassword();

        // Create demo user
        demoUser = await DemoUser.create({
          email: demoRequest.email,
          password: plainPassword,
          name: demoRequest.name,
          company: demoRequest.company,
          approvedAt: new Date(),
        });
      }

      // Update demo request status
      demoRequest.status = 'approved';
      demoRequest.approvedAt = new Date();
      await demoRequest.save();

      // Send email with credentials (only if we created a new user and have the plain-text password)
      if (plainPassword) {
        try {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const loginUrl = `${appUrl}/products/thinkbox?tab=login`;
          await resend.emails.send({
            from: 'ThinkBox <noreply@thinkbox.kaycorp.com>',
            to: demoRequest.email,
            subject: 'Your ThinkBox Beta Access is Approved!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
                <h1 style="color: #58CC02; font-size: 28px; margin-bottom: 8px;">You're in! Welcome to ThinkBox 🎉</h1>
                <p style="font-size: 16px; color: #333;">Hi ${demoRequest.name},</p>
                <p style="font-size: 15px; color: #555;">Your beta tester request has been approved. Below are your login credentials — keep them safe.</p>

                <div style="background: #F7F7F7; border: 1px solid #E5E5E5; padding: 20px; border-radius: 10px; margin: 24px 0;">
                  <p style="margin: 0 0 10px; font-size: 14px;"><strong>Email:</strong></p>
                  <code style="display: block; background: #fff; border: 1px solid #ddd; padding: 10px 14px; border-radius: 6px; font-size: 15px; color: #333;">${demoRequest.email}</code>

                  <p style="margin: 16px 0 10px; font-size: 14px;"><strong>Password:</strong></p>
                  <code style="display: block; background: #fff; border: 1px solid #ddd; padding: 10px 14px; border-radius: 6px; font-size: 15px; color: #333;">${plainPassword}</code>

                  <p style="color: #888; font-size: 12px; margin: 14px 0 0;">Save these details somewhere secure.</p>
                </div>

                <div style="text-align: center; margin: 28px 0;">
                  <a href="${loginUrl}" style="background-color: #58CC02; color: #fff; padding: 14px 36px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 0 #46A302;">
                    Sign In to ThinkBox
                  </a>
                </div>

                <h3 style="font-size: 16px; color: #333;">How to get started:</h3>
                <ol style="color: #555; font-size: 14px; line-height: 1.8;">
                  <li>Click the button above or go to <a href="${loginUrl}" style="color: #58CC02;">${loginUrl}</a></li>
                  <li>Enter your email and the password above</li>
                  <li>Start exploring hundreds of topics across 9 categories — fully offline</li>
                </ol>

                <p style="font-size: 15px; color: #333; margin-top: 24px;">Happy exploring!<br><strong>The ThinkBox Team</strong></p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;">
                <p style="color: #aaa; font-size: 11px;">This is an automated message. Please do not reply directly to this email.</p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
        }
      }

      return NextResponse.json(
        {
          message: 'Demo request approved and user created',
          demoRequest,
          user: {
            email: demoUser.email,
            name: demoUser.name,
            company: demoUser.company,
          },
        },
        { status: 200 }
      );
    } else if (action === 'reject') {
      const { reason } = body;

      demoRequest.status = 'rejected';
      demoRequest.rejectionReason = reason || 'No reason provided';
      await demoRequest.save();

      // Send rejection email
      try {
        await resend.emails.send({
          from: 'noreply@thinkbox.kaycorp.com',
          to: demoRequest.email,
          subject: 'ThinkBox Demo Request - Status Update',
          html: `
            <div style="margin:0;padding:0;background:#F0F0F0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0F0;padding:40px 16px;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr><td style="background:#3C3C3C;border-radius:20px 20px 0 0;padding:32px 40px;text-align:center;">
                      <div style="display:inline-block;background:#fff;border-radius:14px;padding:10px 22px;margin-bottom:16px;">
                        <span style="font-size:22px;font-weight:900;color:#58CC02;font-family:Arial,sans-serif;letter-spacing:-0.5px;">Think<span style="color:#3C3C3C;">Box</span></span>
                      </div>
                      <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;font-family:Arial,sans-serif;">Request Update</h1>
                    </td></tr>

                    <!-- Body -->
                    <tr><td style="background:#fff;padding:36px 40px;">
                      <p style="font-size:16px;color:#3C3C3C;font-family:Arial,sans-serif;margin:0 0 12px;">Hi <strong>${demoRequest.name}</strong>,</p>
                      <p style="font-size:15px;color:#555;font-family:Arial,sans-serif;line-height:1.7;margin:0 0 24px;">Thank you for your interest in ThinkBox. After reviewing your request, we're unable to grant beta access at this time.</p>

                      ${reason ? `
                      <div style="background:#FFF7ED;border:1px solid #fed7aa;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
                        <p style="font-size:12px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;margin:0 0 8px;">Reason</p>
                        <p style="font-size:14px;color:#7c2d12;font-family:Arial,sans-serif;line-height:1.6;margin:0;">${reason}</p>
                      </div>` : ''}

                      <p style="font-size:14px;color:#888;font-family:Arial,sans-serif;line-height:1.7;margin:0;">If you believe this was a mistake or have any questions, feel free to reply to this email and we'll take another look.</p>

                      <p style="font-size:15px;color:#3C3C3C;font-family:Arial,sans-serif;margin:28px 0 0;">Best regards,<br><strong>The ThinkBox Team</strong></p>
                    </td></tr>

                    <!-- Footer -->
                    <tr><td style="background:#F7F7F7;border-radius:0 0 20px 20px;border-top:1px solid #E5E5E5;padding:20px 40px;text-align:center;">
                      <p style="font-size:12px;color:#aaa;font-family:Arial,sans-serif;margin:0;">ThinkBox &mdash; Offline Educational Encyclopedia for Curious Minds</p>
                      <p style="font-size:11px;color:#ccc;font-family:Arial,sans-serif;margin:6px 0 0;">This is an automated message. Please do not reply directly.</p>
                    </td></tr>

                  </table>
                </td></tr>
              </table>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }

      return NextResponse.json(
        {
          message: 'Demo request rejected',
          demoRequest,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to process demo request',
      },
      { status: 500 }
    );
  }
}
