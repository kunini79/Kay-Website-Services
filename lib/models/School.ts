import mongoose, { Document, Schema } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const School =
  mongoose.models.School || mongoose.model<ISchool>('School', schoolSchema);