import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string;
  email?: string;
  event: string;
  details?: any;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId: { type: String, required: true },
  email: { type: String },
  event: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
