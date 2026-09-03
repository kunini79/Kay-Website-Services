import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';
import { School } from '@/lib/models/School';

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name || name.length > 160) {
      return NextResponse.json(
        { message: 'A school name of up to 160 characters is required.' },
        { status: 400 }
      );
    }

    await connectDB();
    const school = await School.create({ name });

    return NextResponse.json(
      { school: { id: school._id.toString(), name: school.name } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { message: 'A school with that name already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Unable to create school.' },
      { status: 500 }
    );
  }
}