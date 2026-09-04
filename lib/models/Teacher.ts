import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacher extends Document {
  email: string;
  name: string;
  school: mongoose.Types.ObjectId;
  password: string;
  role: 'teacher';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['teacher'], default: 'teacher' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Teacher =
  mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', teacherSchema);