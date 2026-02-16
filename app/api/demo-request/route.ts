import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

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
      message: message || '',
      status: 'pending',
    });

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'noreply@thinkbox.kaycorp.com',
        to: email,
        subject: 'ThinkBox Demo Request Received - Approval Pending',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #BBFD6A;">ThinkBox Demo Request Received</h1>
            <p>Hi ${name},</p>
            <p>Thank you for requesting demo access to ThinkBox! We've received your request and our team is reviewing it.</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Request Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Company:</strong> ${company}</p>
              <p><strong>Email:</strong> ${email}</p>
            </div>

            <p>We typically approve demo requests within <strong>24 hours</strong>. Once approved, you'll receive an email with your login credentials and instructions to access ThinkBox.</p>

            <p>If you have any questions in the meantime, feel free to reach out to us.</p>

            <p>Best regards,<br>ThinkBox Team</p>
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
          from: 'noreply@thinkbox.kaycorp.com',
          to: adminEmail,
          subject: `New ThinkBox Demo Request: ${name} from ${company}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #BBFD6A;">New Demo Request</h1>

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Message:</strong> ${message || 'N/A'}</p>
                <p><strong>Request ID:</strong> ${demoRequest._id}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/demo-requests"
                   style="background-color: #BBFD6A; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Review Request in Admin Dashboard
                </a>
              </p>
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
