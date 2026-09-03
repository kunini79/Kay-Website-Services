import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const schoolNames = [
  'American University of Nigeria Schools',
  'Ashmid Bright International Academy',
  'Bright Kids Preparatory School',
  'Crown Nursery and Primary School',
  'Discovery Kids Montessori School',
  'Excellence Elementary School Yola',
  'Hilltop Yola Primary School',
  'Holy Trinity Primary School Yola',
  'Knowledge Elementary School Yola',
  'Premier Basic School',
  'Royal Kids Montessori School',
  'Standard Primary School Yola',
];

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const School = mongoose.models.School || mongoose.model('School', schoolSchema);

async function seedSchools() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required to seed schools.');
  }

  await mongoose.connect(mongoUri);

  const result = await School.bulkWrite(
    schoolNames.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name, isActive: true } },
        upsert: true,
      },
    }))
  );

  console.log(`Yola school seed complete: ${result.upsertedCount} added, ${result.matchedCount} already present.`);
}

seedSchools()
  .catch((error) => {
    console.error('Unable to seed Yola schools:', error instanceof Error ? error.message : 'Unknown error');
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });