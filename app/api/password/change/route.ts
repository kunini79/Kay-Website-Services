import { NextRequest, NextResponse } from 'next/server';
import { DemoUser } from '@/lib/models/DemoUser';
import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current and new passwords are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const user = await DemoUser.findById(auth.userId).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: 'Password changed successfully.' });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
