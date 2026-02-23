import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env.local');
  process.exit(1);
}

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
}, { timestamps: true });

const DemoRequest = mongoose.models?.DemoRequest || mongoose.model('DemoRequest', demoRequestSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const pending = await DemoRequest.find({ status: { $ne: 'approved' } }).sort({ createdAt: -1 }).lean();
  if (pending.length === 0) {
    console.log('No pending demo requests.');
  } else {
    console.log(`Found ${pending.length} pending demo request(s):\n`);
    for (const req of pending) {
      console.log(`- ${req.name} <${req.email}> | Company: ${req.company} | Status: ${req.status} | Created: ${req.createdAt}`);
    }
  }
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
