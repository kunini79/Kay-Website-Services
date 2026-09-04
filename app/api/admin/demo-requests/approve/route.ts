import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';
import { DemoUser } from '@/lib/models/DemoUser';
import { verifyAdminSession } from '@/lib/auth';
import { Resend } from 'resend';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId, ValidationError } from '@/lib/logger';
import crypto from 'crypto';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

/**
 * Sanitize HTML special chars to prevent injection in email templates.
 * Escapes <, >, &, ", ' to safe HTML entities.
 */
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/admin/demo-requests/approve', request);
  const resend = getResendClient();
  const clientIp = getClientIp(request);

  // Rate limit: 20 approve/reject actions per 15 minutes per IP
  const rateLimitResult = rateLimit(`admin-approve:${clientIp}`, 20, 900_000);

  if (!rateLimitResult.success) {
    log.warn('rate limited', { clientIp });
    return withRequestId(
      NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
        }
      ),
      log.requestId
    );
  }

  // Verify signed admin session cookie
  if (!(await verifyAdminSession())) {
    log.warn('unauthorized approve attempt', { clientIp });
    return withRequestId(
      NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      ),
      log.requestId
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

    if (action === 'approve' || action === 'reject') {
      return withRequestId(
        NextResponse.json(
          { message: 'Demo testing has closed. New ThinkBox access is available through school plans and one-month trials.' },
          { status: 410 }
        ),
        log.requestId
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
        // Generate a temporary random password (never shared) and a one-time setup token
        const tempPassword = crypto.randomBytes(32).toString('hex');
        const setupToken = crypto.randomBytes(32).toString('hex');
        const setupTokenExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

        // Create demo user with unusable temp password; user will set their own via setup link
        demoUser = await DemoUser.create({
          email: demoRequest.email,
          password: tempPassword,
          name: demoRequest.name,
          company: demoRequest.company,
          approvedAt: new Date(),
          setupToken,
          setupTokenExpiry,
        });
      }

      // Update demo request status
      demoRequest.status = 'approved';
      demoRequest.approvedAt = new Date();
      await demoRequest.save();

      // Send email with one-time setup link (never expose password or hash)
      try {
        if (resend) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const setupLink = demoUser.setupToken
          ? `${appUrl}/products/thinkbox?setup=${demoUser.setupToken}`
          : `${appUrl}/products/thinkbox`;

        // Sanitize user-controlled fields for HTML email
        const safeName = sanitizeHtml(demoRequest.name);
        const safeEmail = sanitizeHtml(demoRequest.email);

        await resend.emails.send({
          from: 'ThinkBox <noreply@kaycorp.tech>',
          to: demoRequest.email,
          subject: 'Your ThinkBox Access Is Ready',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
              <h1 style="color: #58CC02; font-size: 28px; margin-bottom: 8px;">You're in! Welcome to ThinkBox 🎉</h1>
              <p style="font-size: 16px; color: #333;">Hi ${safeName},</p>
              <p style="font-size: 15px; color: #555;">Your ThinkBox access is ready. Click the button below to choose your password and activate your account.</p>

              <div style="background: #F7F7F7; border: 1px solid #E5E5E5; padding: 20px; border-radius: 10px; margin: 24px 0;">
                <p style="font-size: 14px; color: #333;"><strong>Email:</strong> ${safeEmail}</p>
                <p style="font-size: 13px; color: #888; margin-top: 8px;">This setup link expires in <strong>72 hours</strong>.</p>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${setupLink}" style="background-color: #58CC02; color: #fff; padding: 14px 36px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 0 #46A302;">
                  Set Your Password &amp; Get Started
                </a>
              </div>

              <p style="color: #666; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; font-size: 13px;"><a href="${setupLink}" style="color: #58CC02;">${setupLink}</a></p>

              <p style="font-size: 15px; color: #333; margin-top: 24px;">Happy exploring!<br><strong>The ThinkBox Team</strong></p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;">
              <p style="color: #aaa; font-size: 11px;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
          `,
        });
        }
      } catch (emailError) {
        log.error('failed to send approval email', emailError, { demoRequestId });
      }

      log.info('demo request approved', { demoRequestId, email: demoUser.email });
      return withRequestId(
        NextResponse.json(
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
        ),
        log.requestId
      );
    } else if (action === 'reject') {
      const { reason } = body;

      // Validate rejection reason if provided
      if (reason && typeof reason !== 'string') {
        throw new ValidationError('Rejection reason must be a string');
      }
      if (reason && reason.length > 1000) {
        throw new ValidationError('Rejection reason must be 1000 characters or less');
      }

      demoRequest.status = 'rejected';
      demoRequest.rejectionReason = reason || 'No reason provided';
      await demoRequest.save();

      // Send rejection email
      try {
        if (resend) {
        // Sanitize user-controlled fields for HTML email
        const safeName = sanitizeHtml(demoRequest.name);
        const safeReason = reason ? sanitizeHtml(reason.trim()) : null;

        await resend.emails.send({
          from: 'ThinkBox <noreply@kaycorp.tech>',
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
                      <p style="font-size:16px;color:#3C3C3C;font-family:Arial,sans-serif;margin:0 0 12px;">Hi <strong>${safeName}</strong>,</p>
                      <p style="font-size:15px;color:#555;font-family:Arial,sans-serif;line-height:1.7;margin:0 0 24px;">Thank you for your interest in ThinkBox. After reviewing your request, we're unable to grant beta access at this time.</p>

                      ${safeReason ? `
                      <div style="background:#FFF7ED;border:1px solid #fed7aa;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
                        <p style="font-size:12px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;margin:0 0 8px;">Reason</p>
                        <p style="font-size:14px;color:#7c2d12;font-family:Arial,sans-serif;line-height:1.6;margin:0;">${safeReason}</p>
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
        }
      } catch (emailError) {
        log.error('failed to send rejection email', emailError, { demoRequestId });
      }

      log.info('demo request rejected', { demoRequestId });
      return withRequestId(
        NextResponse.json(
          {
            message: 'Demo request rejected',
            demoRequest,
          },
          { status: 200 }
        ),
        log.requestId
      );
    } else {
      return withRequestId(
        NextResponse.json(
          { message: 'Invalid action. Use "approve" or "reject"' },
          { status: 400 }
        ),
        log.requestId
      );
    }
  } catch (error) {
    log.error('demo request processing failed', error);
    return withRequestId(
      NextResponse.json(
        {
          message:
            error instanceof Error ? error.message : 'Failed to process demo request',
        },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
