import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { School } from '@/lib/models/School';

export async function GET() {
  try {
    await connectDB();

    const schools = await School.find({ isActive: true })
      .select('_id name')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      schools: schools.map((school) => ({
        id: String(school._id),
        name: school.name,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: 'Unable to load schools. Please try again later.' },
      { status: 500 }
    );
  }
}