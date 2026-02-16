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

      if (!demoUser) {
        // Generate password
        const password = generatePassword();

        // Create demo user
        demoUser = await DemoUser.create({
          email: demoRequest.email,
          password,
          name: demoRequest.name,
          company: demoRequest.company,
          approvedAt: new Date(),
        });
      }

      // Update demo request status
      demoRequest.status = 'approved';
      demoRequest.approvedAt = new Date();
      await demoRequest.save();

      // Send email with credentials
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await resend.emails.send({
          from: 'noreply@thinkbox.kaycorp.com',
          to: demoRequest.email,
          subject: 'Your ThinkBox Demo Access Approved!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #BBFD6A;">🎉 Your ThinkBox Demo Access is Ready!</h1>
              <p>Hi ${demoRequest.name},</p>
              <p>Great news! Your demo request has been approved. You now have full access to the ThinkBox system.</p>

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> <code style="background-color: white; padding: 5px 10px; border-radius: 3px;">${demoRequest.email}</code></p>
                <p><strong>Password:</strong> <code style="background-color: white; padding: 5px 10px; border-radius: 3px;">${demoUser.password}</code></p>
                <p style="color: #666; font-size: 12px; margin-top: 15px;">
                  💡 <strong>Tip:</strong> Make sure to save your password in a secure location. You can change it after your first login.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${appUrl}/thinkbox" style="background-color: #BBFD6A; color: black; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Access ThinkBox Now
                </a>
              </div>

              <h3>Getting Started:</h3>
              <ol>
                <li>Go to <a href="${appUrl}/thinkbox">${appUrl}/thinkbox</a></li>
                <li>Click the "Sign In" tab</li>
                <li>Enter your email and password</li>
                <li>Start exploring topics with our AI-powered system!</li>
              </ol>

              <h3>Need Help?</h3>
              <p>If you have any questions or encounter any issues, please don't hesitate to reach out to us.</p>

              <p>Happy learning!<br>The ThinkBox Team</p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email. Please do not reply to this address.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #666;">ThinkBox Demo Request Update</h1>
              <p>Hi ${demoRequest.name},</p>
              <p>Thank you for your interest in ThinkBox. Unfortunately, we're unable to approve your demo request at this time.</p>

              ${reason ? `<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Reason:</strong> ${reason}</p>
              </div>` : ''}

              <p>If you have any questions or would like more information, please feel free to contact us.</p>

              <p>Best regards,<br>The ThinkBox Team</p>
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
