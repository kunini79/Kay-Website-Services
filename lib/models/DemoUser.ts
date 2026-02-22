import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IDemoUser extends Document {
  email: string;
  password: string;
  name: string;
  company: string;
  createdAt: Date;
  approvedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const demoUserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    approvedAt: {
      type: Date,
      required: true,
    },
    lastLoginAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    // ThinkBox progress fields
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    achievements: { type: Object, default: {} },
    history: { type: Array, default: [] },
    backpack: { type: Array, default: [] },
    quizzesCompleted: { type: Number, default: 0 },
    perfectQuizzes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
demoUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
demoUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export const DemoUser =
  mongoose.models.DemoUser ||
  mongoose.model<IDemoUser>('DemoUser', demoUserSchema);
