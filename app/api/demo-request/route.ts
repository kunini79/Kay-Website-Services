import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, role, useCase, message } = body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { message: 'Name, email, and company are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user has already requested demo
    const existingRequest = await DemoRequest.findOne({ email });
    if (existingRequest) {
      return NextResponse.json(
        {
          message:
            'A demo request with this email already exists. Please check your email for approval status.',
        },
        { status: 400 }
      );
    }

    // Create demo request
    const demoRequest = await DemoRequest.create({
      name,
      email,
      company,
      phone: phone || '',
      role: role || '',
      useCase: useCase || '',
      message: message || '',
      status: 'pending',
    });

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'ThinkBox <noreply@thinkbox.kaycorp.com>',
        to: email,
        subject: "We've received your ThinkBox beta request!",
        html: `
          <div style="margin:0;padding:0;background:#F0F0F0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0F0;padding:40px 16px;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr><td style="background:#58CC02;border-radius:20px 20px 0 0;padding:32px 40px;text-align:center;">
                    <div style="display:inline-block;background:#fff;border-radius:14px;padding:10px 22px;margin-bottom:16px;">
                      <span style="font-size:22px;font-weight:900;color:#58CC02;font-family:Arial,sans-serif;letter-spacing:-0.5px;">Think<span style="color:#3C3C3C;">Box</span></span>
                    </div>
                    <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;font-family:Arial,sans-serif;">Request Received!</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;font-family:Arial,sans-serif;">We'll review your details and get back to you shortly.</p>
                  </td></tr>

                  <!-- Body -->
                  <tr><td style="background:#fff;padding:36px 40px;">
                    <p style="font-size:16px;color:#3C3C3C;font-family:Arial,sans-serif;margin:0 0 12px;">Hi <strong>${name}</strong>,</p>
                    <p style="font-size:15px;color:#555;font-family:Arial,sans-serif;line-height:1.7;margin:0 0 28px;">Thanks for signing up to be a ThinkBox beta tester! We've received your request and our team is reviewing it. We'll send your login credentials within <strong>24 hours</strong>.</p>

                    <!-- Details card -->
                    <div style="background:#F7F7F7;border:1px solid #E5E5E5;border-radius:14px;padding:24px;margin-bottom:28px;">
                      <p style="font-size:12px;font-weight:700;color:#58CC02;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;margin:0 0 16px;">Your Submission</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:6px 0;width:120px;">Name</td><td style="font-size:14px;color:#3C3C3C;font-family:Arial,sans-serif;font-weight:600;padding:6px 0;">${name}</td></tr>
                        <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:6px 0;">Email</td><td style="font-size:14px;color:#3C3C3C;font-family:Arial,sans-serif;font-weight:600;padding:6px 0;">${email}</td></tr>
                        <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:6px 0;">Organisation</td><td style="font-size:14px;color:#3C3C3C;font-family:Arial,sans-serif;font-weight:600;padding:6px 0;">${company}</td></tr>
                        ${role ? `<tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:6px 0;">Role</td><td style="font-size:14px;color:#3C3C3C;font-family:Arial,sans-serif;font-weight:600;padding:6px 0;">${role}</td></tr>` : ''}
                        ${useCase ? `<tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:6px 0;">Use Case</td><td style="font-size:14px;color:#3C3C3C;font-family:Arial,sans-serif;font-weight:600;padding:6px 0;">${useCase}</td></tr>` : ''}
                      </table>
                    </div>

                    <!-- What happens next -->
                    <div style="background:#F0FDF4;border:1px solid #bbf7d0;border-radius:14px;padding:20px 24px;margin-bottom:28px;">
                      <p style="font-size:13px;font-weight:700;color:#15803d;font-family:Arial,sans-serif;margin:0 0 10px;">&#x23F3; What happens next?</p>
                      <p style="font-size:13px;color:#166534;font-family:Arial,sans-serif;line-height:1.7;margin:0;">Our team will review your request and send your login credentials to this email address. Once you receive them, you can sign in and start exploring hundreds of topics — fully offline.</p>
                    </div>

                    <p style="font-size:14px;color:#888;font-family:Arial,sans-serif;margin:0;">If you have questions, just reply to this email.</p>
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
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the entire request if email fails
    }

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await resend.emails.send({
          from: 'ThinkBox Admin <noreply@thinkbox.kaycorp.com>',
          to: adminEmail,
          subject: `[ThinkBox] New Beta Request: ${name} from ${company}`,
          html: `
            <div style="margin:0;padding:0;background:#F0F0F0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0F0;padding:40px 16px;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr><td style="background:#3C3C3C;border-radius:20px 20px 0 0;padding:28px 40px;">
                      <div style="display:inline-block;background:#58CC02;border-radius:10px;padding:6px 16px;margin-bottom:12px;">
                        <span style="font-size:13px;font-weight:800;color:#fff;font-family:Arial,sans-serif;letter-spacing:0.05em;text-transform:uppercase;">Admin Alert</span>
                      </div>
                      <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;font-family:Arial,sans-serif;">New Beta Tester Request</h1>
                      <p style="margin:6px 0 0;color:#aaa;font-size:13px;font-family:Arial,sans-serif;">${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    </td></tr>

                    <!-- Body -->
                    <tr><td style="background:#fff;padding:36px 40px;">
                      <div style="background:#F7F7F7;border:1px solid #E5E5E5;border-radius:14px;padding:24px;margin-bottom:24px;">
                        <p style="font-size:12px;font-weight:700;color:#58CC02;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;margin:0 0 16px;">Request Details</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;width:130px;border-bottom:1px solid #f0f0f0;">Name</td><td style="font-size:14px;color:#3C3C3C;font-weight:700;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">${name}</td></tr>
                          <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">Email</td><td style="font-size:14px;color:#3C3C3C;font-weight:700;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:#58CC02;text-decoration:none;">${email}</a></td></tr>
                          ${phone ? `<tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">Phone</td><td style="font-size:14px;color:#3C3C3C;font-weight:700;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">${phone}</td></tr>` : ''}
                          <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">Organisation</td><td style="font-size:14px;color:#3C3C3C;font-weight:700;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">${company}</td></tr>
                          ${role ? `<tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">Role</td><td style="font-size:14px;color:#3C3C3C;font-weight:700;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">${role}</td></tr>` : ''}
                          ${useCase ? `<tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">Use Case</td><td style="font-size:14px;color:#3C3C3C;font-weight:700;font-family:Arial,sans-serif;padding:7px 0;border-bottom:1px solid #f0f0f0;">${useCase}</td></tr>` : ''}
                          <tr><td style="font-size:13px;color:#888;font-family:Arial,sans-serif;padding:7px 0;">Message</td><td style="font-size:14px;color:#3C3C3C;font-family:Arial,sans-serif;padding:7px 0;font-style:italic;">${message || '—'}</td></tr>
                        </table>
                      </div>

                      <div style="text-align:center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/demo-requests" style="background:#58CC02;color:#fff;padding:14px 36px;text-decoration:none;border-radius:12px;font-weight:800;font-size:15px;display:inline-block;box-shadow:0 4px 0 #46A302;font-family:Arial,sans-serif;">
                          Review in Admin Dashboard &rarr;
                        </a>
                      </div>
                    </td></tr>

                    <!-- Footer -->
                    <tr><td style="background:#F7F7F7;border-radius:0 0 20px 20px;border-top:1px solid #E5E5E5;padding:16px 40px;text-align:center;">
                      <p style="font-size:11px;color:#ccc;font-family:Arial,sans-serif;margin:0;">ThinkBox Admin &mdash; Request ID: ${demoRequest._id}</p>
                    </td></tr>

                  </table>
                </td></tr>
              </table>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    return NextResponse.json(
      {
        message: 'Demo request submitted successfully. Check your email for updates.',
        demoRequestId: demoRequest._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Demo request error:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to submit demo request',
      },
      { status: 500 }
    );
  }
}
