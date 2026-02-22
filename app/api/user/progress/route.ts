import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoUser } from '@/lib/models/DemoUser';

// Progress schema: XP, streak, achievements, history, backpack, quizzes
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ message: 'Missing user ID' }, { status: 401 });
    await connectDB();
    const user = await DemoUser.findById(userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({
      xp: user.xp || 0,
      streak: user.streak || 1,
      achievements: user.achievements || {},
      history: user.history || [],
      backpack: user.backpack || [],
      quizzesCompleted: user.quizzesCompleted || 0,
      perfectQuizzes: user.perfectQuizzes || 0,
    });
  } catch (err) {
    return NextResponse.json({ message: 'Error', error: typeof err === 'object' && err !== null ? (err as any).message : String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ message: 'Missing user ID' }, { status: 401 });
    const body = await request.json();
    await connectDB();
    const user = await DemoUser.findById(userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    // Update progress fields
    user.xp = body.xp ?? user.xp;
    user.streak = body.streak ?? user.streak;
    user.achievements = body.achievements ?? user.achievements;
    user.history = body.history ?? user.history;
    user.backpack = body.backpack ?? user.backpack;
    user.quizzesCompleted = body.quizzesCompleted ?? user.quizzesCompleted;
    user.perfectQuizzes = body.perfectQuizzes ?? user.perfectQuizzes;
    await user.save();
    return NextResponse.json({ message: 'Progress updated' });
  } catch (err) {
    return NextResponse.json({ message: 'Error', error: typeof err === 'object' && err !== null ? (err as any).message : String(err) }, { status: 500 });
  }
}
