import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

const demoRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  phone: String,
  role: String,
  useCase: String,
  message: String,
  status: String,
  createdAt: Date,
  updatedAt: Date,
  approvedAt: Date,
}, { timestamps: true });
const DemoRequest = mongoose.models?.DemoRequest || mongoose.model('DemoRequest', demoRequestSchema);

export async function POST(request: NextRequest) {
  await connectDB();
  const { id } = await request.json();
  const req = await DemoRequest.findById(id);
  if (!req) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  req.status = 'approved';
  req.approvedAt = new Date();
  await req.save();
  return NextResponse.json({ success: true });
}
