import mongoose, { Schema, Document } from 'mongoose';

export interface IDemoRequest extends Document {
  name: string;
  email: string;
  company: string;
  phone?: string;
  role?: string;
  useCase?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
  rejectionReason?: string;
}

const demoRequestSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      lowercase: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    useCase: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

export const DemoRequest =
  mongoose.models.DemoRequest ||
  mongoose.model<IDemoRequest>('DemoRequest', demoRequestSchema);
