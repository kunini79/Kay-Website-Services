import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';
import { DemoUser } from '@/lib/models/DemoUser';
import { School } from '@/lib/models/School';

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schoolId = typeof body.schoolId === 'string' ? body.schoolId : '';
    const studentId = typeof body.studentId === 'string' ? body.studentId.trim().toUpperCase() : '';
    const pin = typeof body.pin === 'string' ? body.pin : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!mongoose.isValidObjectId(schoolId)) {
      return NextResponse.json({ message: 'A valid school is required.' }, { status: 400 });
    }
    if (!/^[A-Z0-9-]{2,40}$/.test(studentId)) {
      return NextResponse.json(
        { message: 'User ID must contain 2 to 40 letters, numbers, or hyphens.' },
        { status: 400 }
      );
    }
    if (!/^\d{4,8}$/.test(pin)) {
      return NextResponse.json(
        { message: 'PIN must contain 4 to 8 digits.' },
        { status: 400 }
      );
    }
    if (!name || name.length > 120) {
      return NextResponse.json(
        { message: 'Student name is required and must be 120 characters or less.' },
        { status: 400 }
      );
    }

    await connectDB();
    const school = await School.findOne({ _id: schoolId, isActive: true });

    if (!school) {
      return NextResponse.json({ message: 'School is not available.' }, { status: 400 });
    }

    const student = await DemoUser.create({
      name,
      company: school.name,
      school: school._id,
      studentId,
      pin,
      approvedAt: new Date(),
    });

    return NextResponse.json(
      {
        student: {
          id: student._id.toString(),
          name: student.name,
          schoolId: school._id.toString(),
          studentId: student.studentId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { message: 'This User ID is already assigned at the selected school.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Unable to create student account.' },
      { status: 500 }
    );
  }
}