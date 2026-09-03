import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IDemoUser extends Document {
  email?: string;
  password?: string;
  name: string;
  company: string;
  school?: mongoose.Types.ObjectId;
  studentId?: string;
  pin?: string;
  createdAt: Date;
  approvedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  comparePin(candidatePin: string): Promise<boolean>;
}

const demoUserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      lowercase: true,
    },
    password: {
      type: String,
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
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },
    studentId: {
      type: String,
      trim: true,
      uppercase: true,
    },
    pin: {
      type: String,
      select: false,
    },
    setupToken: {
      type: String,
    },
    setupTokenExpiry: {
      type: Date,
    },
    // ThinkBox progress fields
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    achievements: { type: Object, default: {} },
    history: { type: Array, default: [] },
    backpack: { type: Array, default: [] },
    quizzesCompleted: { type: Number, default: 0 },
    perfectQuizzes: { type: Number, default: 0 },
    
    // Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

demoUserSchema.index({ school: 1, studentId: 1 }, { unique: true, sparse: true });

// Hash password before saving
demoUserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password') && this.password) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }

    if (this.isModified('pin') && this.pin) {
      const salt = await bcryptjs.genSalt(10);
      this.pin = await bcryptjs.hash(this.pin, salt);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
demoUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcryptjs.compare(candidatePassword, this.password);
};

demoUserSchema.methods.comparePin = async function (
  candidatePin: string
): Promise<boolean> {
  if (!this.pin) return false;
  return await bcryptjs.compare(candidatePin, this.pin);
};

export const DemoUser =
  mongoose.models.DemoUser ||
  mongoose.model<IDemoUser>('DemoUser', demoUserSchema);
