import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/contact', request);
  try {
    // Rate limiting: 5 requests per hour per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, 5, 3600000);

    if (!rateLimitResult.success) {
      log.warn('rate limited', { clientIp, retryAfter: rateLimitResult.retryAfter });
      return withRequestId(
        NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { 
            status: 429,
            headers: {
              'Retry-After': String(rateLimitResult.retryAfter),
            }
          }
        ),
        log.requestId
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing RESEND_API_KEY' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Kay Website Services <info@kaycorp.tech>',
      to: ['info@kaycorp.tech'], // Public-facing inbox
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #84cc16;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This email was sent from your Kay Website Services contact form.
          </p>
        </div>
      `,
      replyTo: email, // Allow you to reply directly to the sender
    });

    if (data.error) {
      log.error('resend API error', data.error);
      return withRequestId(
        NextResponse.json(
          { error: data.error.message || 'Failed to send email' },
          { status: 502 }
        ),
        log.requestId
      );
    }

    log.info('contact email sent', { emailId: data?.data?.id });
    return withRequestId(
      NextResponse.json(
        { message: 'Email sent successfully', id: data?.data?.id ?? null },
        { status: 200 }
      ),
      log.requestId
    );
  } catch (error) {
    log.error('contact form failed', error);
    return withRequestId(
      NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
