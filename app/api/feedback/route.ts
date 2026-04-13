import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}
const adminEmail = process.env.ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  try {
    const resend = getResendClient();
    const { feedback, email } = await request.json();
    if (!feedback || typeof feedback !== 'string' || feedback.length < 5) {
      return NextResponse.json({ message: 'Feedback is required.' }, { status: 400 });
    }
    // Send feedback to admin
    if (adminEmail && resend) {
      await resend.emails.send({
        from: 'ThinkBox Feedback <noreply@thinkbox.kaycorp.com>',
        to: adminEmail,
        subject: 'New ThinkBox Feedback Submission',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
            <h2 style="color: #58CC02; font-size: 22px; margin-bottom: 12px;">New Feedback Submission</h2>
            <p style="font-size: 15px; color: #333; margin-bottom: 18px;">${feedback}</p>
            ${email ? `<p style="font-size: 13px; color: #888; margin-bottom: 0;"><strong>From:</strong> ${email}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;">
            <p style="color: #aaa; font-size: 11px;">This is an automated message from ThinkBox feedback form.</p>
          </div>
        `,
      });
    }
    return NextResponse.json({ message: 'Feedback submitted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to submit feedback.' }, { status: 500 });
  }
}
