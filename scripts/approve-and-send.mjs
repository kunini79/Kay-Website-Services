import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

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
  approvedAt: Date,
}, { timestamps: true });
const DemoRequest = mongoose.models?.DemoRequest || mongoose.model('DemoRequest', demoRequestSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const emails = [
    'blazepasy@gmail.com',
    'lazaruskadwama@gmail.com',
    'malodeyforyou@yahoo.com',
    'musapadahsaadatu@gmail.com',
  ];
  const updated = await DemoRequest.updateMany(
    { email: { $in: emails } },
    { $set: { status: 'approved', approvedAt: new Date() } }
  );
  console.log(`Approved ${updated.modifiedCount} requests.`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
