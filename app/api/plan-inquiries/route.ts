import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/lib/db';
import { PlanInquiry } from '@/lib/models/PlanInquiry';
import { createRequestLogger, withRequestId } from '@/lib/logger';
import { getClientIp, rateLimit } from '@/utils/rateLimit';

const planLabels = {
  'standard-campus-lab': 'Standard Campus Lab',
  'premium-campus': 'Premium / Multi-Arm Campus',
  'network-schools': 'Network / Group of Schools',
  'turnkey-kit': 'Turnkey Hardware + Software Kit',
} as const;

type PlanKey = keyof typeof planLabels;

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/plan-inquiries', request);
  const clientIp = getClientIp(request);
  const limit = rateLimit(`plan-inquiry:${clientIp}`, 3, 3_600_000);

  if (!limit.success) {
    return withRequestId(
      NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      ),
      log.requestId
    );
  }

  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const organisation = typeof body.organisation === 'string' ? body.organisation.trim() : '';
    const selectedPlan = typeof body.selectedPlan === 'string' ? body.selectedPlan : '';
    const billingPreference = typeof body.billingPreference === 'string' ? body.billingPreference : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !organisation || !(selectedPlan in planLabels) || !['annual', 'termly', 'discuss'].includes(billingPreference)) {
      return withRequestId(
        NextResponse.json({ message: 'Complete your contact details and choose a plan.' }, { status: 400 }),
        log.requestId
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return withRequestId(
        NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 }),
        log.requestId
      );
    }

    await connectDB();
    const inquiry = await PlanInquiry.create({
      name,
      email,
      phone,
      organisation,
      selectedPlan,
      billingPreference,
      message,
      trialRequested: true,
    });

    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (resendKey && adminEmail) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'ThinkBox <noreply@kaycorp.tech>',
        to: adminEmail,
        subject: `[ThinkBox] New plan enquiry: ${planLabels[selectedPlan as PlanKey]}`,
        text: `Plan: ${planLabels[selectedPlan as PlanKey]}\nOrganisation: ${organisation}\nContact: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nBilling preference: ${billingPreference}\nOne-month trial requested: Yes\nNotes: ${message || 'None'}\nInquiry ID: ${inquiry._id.toString()}`,
      });
    }

    log.info('plan inquiry created', { inquiryId: inquiry._id.toString(), selectedPlan });
    return withRequestId(
      NextResponse.json({ message: 'Your plan enquiry has been received.' }, { status: 201 }),
      log.requestId
    );
  } catch (error) {
    log.error('plan inquiry failed', error);
    return withRequestId(
      NextResponse.json({ message: 'Unable to submit your plan enquiry. Please try again.' }, { status: 500 }),
      log.requestId
    );
  }
}