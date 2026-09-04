import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { verifyAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { DemoUser } from '@/lib/models/DemoUser';
import { Teacher } from '@/lib/models/Teacher';

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminSession();
  const auth = isAdmin ? null : await verifyAuth();
  if (!isAdmin && auth?.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const teacher = auth?.role === 'teacher'
      ? await Teacher.findById(auth.userId).select('school').lean<{ school?: { toString(): string } | string }>()
      : null;
    if (auth?.role === 'teacher' && !teacher) {
      return NextResponse.json({ message: 'Teacher account not found' }, { status: 404 });
    }
    const requestedSchoolId = request.nextUrl.searchParams.get('schoolId');
    const schoolId = teacher?.school?.toString() || requestedSchoolId;
    const filter = schoolId ? { school: schoolId, isActive: true } : { isActive: true };
    const students = await DemoUser.find(filter)
      .select('name studentId company school xp streak history quizzesCompleted perfectQuizzes topicMastery lastLoginAt')
      .sort({ name: 1 })
      .lean();

    const reports = students.map((student) => {
      const mastery = (student.topicMastery || {}) as Record<string, { accuracy?: number; level?: number; nextReviewAt?: number }>;
      const masteryEntries = Object.entries(mastery);
      const dueReviews = masteryEntries.filter(([, value]) => (value.nextReviewAt || 0) <= Date.now()).length;
      const accuracy = masteryEntries.length > 0
        ? masteryEntries.reduce((sum, [, value]) => sum + (value.accuracy || 0), 0) / masteryEntries.length
        : 0;

      return {
        id: String(student._id),
        name: student.name,
        studentId: student.studentId,
        school: student.company,
        xp: student.xp || 0,
        streak: student.streak || 1,
        articlesRead: Array.isArray(student.history) ? student.history.length : 0,
        quizzesCompleted: student.quizzesCompleted || 0,
        perfectQuizzes: student.perfectQuizzes || 0,
        topicsMastered: masteryEntries.length,
        averageAccuracy: Math.round(accuracy * 100),
        dueReviews,
        lastLoginAt: student.lastLoginAt || null,
      };
    });

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Failed to load ThinkBox reports:', error);
    return NextResponse.json({ message: 'Unable to load reports' }, { status: 500 });
  }
}