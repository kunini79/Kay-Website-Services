import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/lib/db';
import { ActivityLog } from '@/lib/models/ActivityLog';
import { NewsletterSubscriber } from '@/lib/models/NewsletterSubscriber';
import { createRequestLogger, ValidationError, withRequestId } from '@/lib/logger';
import { getClientIp, rateLimit } from '@/utils/rateLimit';

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/newsletter/subscribe', request);
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`newsletter:${clientIp}`, 5, 3_600_000);

  if (!rateLimitResult.success) {
    log.warn('rate limited', { clientIp, retryAfter: rateLimitResult.retryAfter });
    return withRequestId(
      NextResponse.json(
        { message: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
        }
      ),
      log.requestId
    );
  }

  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const source = typeof body?.source === 'string' && body.source.trim() ? body.source.trim() : 'blog';

    if (!email) {
      throw new ValidationError('Email is required');
    }

    if (email.length > 254 || !isValidEmail(email)) {
      throw new ValidationError('Please enter a valid email address');
    }

    await connectDB();

    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status !== 'subscribed') {
        existingSubscriber.status = 'subscribed';
        existingSubscriber.source = source;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.metadata = {
          ...(existingSubscriber.metadata || {}),
          resubscribedFrom: source,
        };
        await existingSubscriber.save();
      }

      log.info('newsletter already subscribed', { email, source });
      return withRequestId(
        NextResponse.json(
          { message: 'You are already subscribed to the newsletter.' },
          { status: 200 }
        ),
        log.requestId
      );
    }

    const subscriber = await NewsletterSubscriber.create({
      email,
      source,
      status: 'subscribed',
      metadata: {
        clientIp,
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    await ActivityLog.create({
      userId: `newsletter:${subscriber._id}`,
      email,
      event: 'newsletter_signup',
      details: {
        source,
        subscriberId: String(subscriber._id),
      },
    });

    const resend = getResendClient();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (resend && adminEmail) {
      const safeEmail = sanitizeHtml(email);
      try {
        await resend.emails.send({
          from: 'KayCorp Blog <noreply@kaycorp.tech>',
          to: adminEmail,
          subject: `[KayCorp Blog] New Newsletter Signup: ${safeEmail}`,
          html: `
            <div style="margin:0;padding:0;background:#F5F5F5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:40px 16px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                      <tr>
                        <td style="background:#0A0A0A;border-radius:20px 20px 0 0;padding:28px 40px;">
                          <div style="display:inline-block;background:#BBFD6A;border-radius:999px;padding:6px 14px;margin-bottom:12px;">
                            <span style="font-size:12px;font-weight:800;color:#0A0A0A;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;">Newsletter Alert</span>
                          </div>
                          <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;font-family:Arial,sans-serif;">New blog subscriber</h1>
                          <p style="margin:8px 0 0;color:rgba(255,255,255,0.72);font-size:14px;font-family:Arial,sans-serif;">A new visitor subscribed from the KayCorp blog.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#fff;padding:32px 40px;">
                          <div style="background:#F7F7F7;border:1px solid #E5E5E5;border-radius:16px;padding:22px;">
                            <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">Subscriber details</p>
                            <p style="margin:0 0 10px;font-size:15px;color:#111827;font-family:Arial,sans-serif;"><strong>Email:</strong> ${safeEmail}</p>
                            <p style="margin:0 0 10px;font-size:15px;color:#111827;font-family:Arial,sans-serif;"><strong>Source:</strong> ${sanitizeHtml(source)}</p>
                            <p style="margin:0;font-size:15px;color:#111827;font-family:Arial,sans-serif;"><strong>Time:</strong> ${sanitizeHtml(new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' }))}</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#F7F7F7;border-top:1px solid #E5E5E5;border-radius:0 0 20px 20px;padding:16px 40px;text-align:center;">
                          <p style="margin:0;font-size:11px;color:#9CA3AF;font-family:Arial,sans-serif;">KayCorp Blog newsletter notification</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          `,
        });
      } catch (emailError) {
        log.error('newsletter admin email failed', emailError, { email });
      }
    }

    log.info('newsletter signup created', {
      subscriberId: String(subscriber._id),
      email,
      source,
    });

    return withRequestId(
      NextResponse.json(
        { message: 'Thanks for subscribing. You are on the list.' },
        { status: 201 }
      ),
      log.requestId
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      log.warn('newsletter validation failed', { error: error.message });
      return withRequestId(
        NextResponse.json({ message: error.message }, { status: 400 }),
        log.requestId
      );
    }

    log.error('newsletter signup failed', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Failed to subscribe right now. Please try again.' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
