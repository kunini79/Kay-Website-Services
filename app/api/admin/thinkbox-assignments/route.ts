import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, verifyAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Teacher } from '@/lib/models/Teacher';
import { ThinkBoxAssignment } from '@/lib/models/ThinkBoxAssignment';

async function context() {
  const isAdmin = await verifyAdminSession();
  const auth = isAdmin ? null : await verifyAuth();
  if (!isAdmin && auth?.role !== 'teacher') return null;
  const teacher = auth?.role === 'teacher' ? await Teacher.findById(auth.userId).select('school').lean<{ school: unknown }>() : null;
  if (auth?.role === 'teacher' && !teacher) return null;
  return { isAdmin, auth, teacher };
}

export async function GET() {
  const access = await context();
  if (!access) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const filter = access.teacher ? { school: access.teacher.school } : {};
  const assignments = await ThinkBoxAssignment.find(filter).sort({ dueDate: 1 }).lean();
  return NextResponse.json({ assignments });
}

export async function POST(request: NextRequest) {
  const access = await context();
  if (!access || !access.teacher || !access.auth?.userId) return NextResponse.json({ message: 'Teacher access required' }, { status: 403 });
  const body = await request.json();
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const pathId = typeof body.pathId === 'string' ? body.pathId.trim() : '';
  const topics = Array.isArray(body.topics) ? body.topics.filter((topic: unknown): topic is string => typeof topic === 'string').map((topic: string) => topic.trim()).filter(Boolean) : [];
  const dueDate = new Date(body.dueDate);
  if (!title || !pathId || topics.length === 0 || !Number.isFinite(dueDate.getTime())) return NextResponse.json({ message: 'Title, path, topics, and due date are required' }, { status: 400 });
  await connectDB();
  const assignment = await ThinkBoxAssignment.create({ teacher: access.auth.userId, school: access.teacher.school, title, pathId, topics, dueDate });
  return NextResponse.json({ assignment }, { status: 201 });
}