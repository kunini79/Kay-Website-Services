import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminAccount extends Document {
  email: string;
  name: string;
  password: string;
  role: 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminAccountSchema = new Schema<IAdminAccount>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AdminAccount =
  mongoose.models.AdminAccount || mongoose.model<IAdminAccount>('AdminAccount', adminAccountSchema);