import mongoose, { Document, Schema } from 'mongoose';

export interface IPlanInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  organisation: string;
  selectedPlan: 'standard-campus-lab' | 'premium-campus' | 'network-schools' | 'turnkey-kit' | 'individual-license';
  billingPreference: 'annual' | 'termly' | 'discuss';
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  trialRequested: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planInquirySchema = new Schema<IPlanInquiry>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phone: { type: String, trim: true },
    organisation: { type: String, required: [true, 'Organisation is required'], trim: true },
    selectedPlan: {
      type: String,
      required: [true, 'A plan is required'],
      enum: ['standard-campus-lab', 'premium-campus', 'network-schools', 'turnkey-kit', 'individual-license'],
    },
    billingPreference: {
      type: String,
      required: true,
      enum: ['annual', 'termly', 'discuss'],
    },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    trialRequested: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PlanInquiry =
  mongoose.models.PlanInquiry || mongoose.model<IPlanInquiry>('PlanInquiry', planInquirySchema);