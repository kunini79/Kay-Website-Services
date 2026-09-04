import mongoose, { Document, Schema } from 'mongoose';

export interface IThinkBoxAssignment extends Document {
  teacher: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  title: string;
  pathId: string;
  topics: string[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IThinkBoxAssignment>(
  {
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    title: { type: String, required: true, trim: true },
    pathId: { type: String, required: true, trim: true },
    topics: { type: [String], required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const ThinkBoxAssignment =
  mongoose.models.ThinkBoxAssignment || mongoose.model<IThinkBoxAssignment>('ThinkBoxAssignment', assignmentSchema);