import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message: 'Demo testing has closed. Choose a ThinkBox school plan and request a one-month trial instead.',
      plansUrl: '/products/thinkbox#plans',
    },
    { status: 410 }
  );
}
