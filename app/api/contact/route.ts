import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId, ValidationError } from '@/lib/logger';

/**
 * Sanitize HTML special chars to prevent injection in email templates.
 * Escapes <, >, &, ", ' and newlines to safe HTML entities.
 */
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\n/g, '<br>');
}

/**
 * Validate email format with stricter rules to block disposable/spam domains.
 */
function isValidEmail(email: string): boolean {
  // Basic RFC 5322 pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Block suspicious patterns
  const lowerEmail = email.toLowerCase();
  const suspiciousPatterns = [
    /\+.*spam/i,       // email+spam@domain
    /noreply|no-reply/i,
    /test\d+@/i,       // test123@domain
    /@mailinator\.|@guerrillamail\.|@temp-mail\.|@10minutemail\./i,  // disposable domains
  ];

  return !suspiciousPatterns.some(pattern => pattern.test(lowerEmail));
}

/**
 * Validate phone number (optional field) — allow common formats or empty.
 */
function isValidPhone(phone: string | undefined): boolean {
  if (!phone || phone.trim() === '') return true;
  // Accept: +1234567890, (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^[\d\s()+-]{7,20}$/;
  return phoneRegex.test(phone);
}

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
      throw new ValidationError('Missing required fields: name, email, and message are required');
    }

    // Strict length validation
    if (name.length > 100) {
      throw new ValidationError('Name must be 100 characters or less');
    }
    if (email.length > 254) {  // RFC 5321 max email length
      throw new ValidationError('Email address is too long');
    }
    if (message.length < 10) {
      throw new ValidationError('Message must be at least 10 characters');
    }
    if (message.length > 5000) {
      throw new ValidationError('Message must be 5000 characters or less');
    }

    // Email format + spam detection
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid or suspicious email address');
    }

    // Phone validation (optional field)
    if (!isValidPhone(phone)) {
      throw new ValidationError('Invalid phone number format');
    }

    // Sanitize all user inputs for HTML email template
    const safeName = sanitizeHtml(name.trim());
    const safeEmail = sanitizeHtml(email.trim());
    const safePhone = phone ? sanitizeHtml(phone.trim()) : null;
    const safeMessage = sanitizeHtml(message.trim());

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Kay Website Services <info@kaycorp.tech>',
      to: ['info@kaycorp.tech'], // Public-facing inbox
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #84cc16;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${safeEmail}</p>
            ${safePhone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${safePhone}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${safeMessage}</p>
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
    // Handle validation errors with 400 status
    if (error instanceof ValidationError) {
      log.warn('contact form validation failed', { error: error.message });
      return withRequestId(
        NextResponse.json(
          { error: error.message },
          { status: 400 }
        ),
        log.requestId
      );
    }

    // Handle other errors with 500 status
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
