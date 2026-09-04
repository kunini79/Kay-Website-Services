import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const schoolSchema = new mongoose.Schema({ name: String, isActive: Boolean });
const adminSchema = new mongoose.Schema({ email: String, name: String, password: String, role: String, isActive: Boolean }, { timestamps: true });
const teacherSchema = new mongoose.Schema({ email: String, name: String, school: mongoose.Schema.Types.ObjectId, password: String, role: String, isActive: Boolean }, { timestamps: true });
const School = mongoose.models.School || mongoose.model('School', schoolSchema);
const AdminAccount = mongoose.models.AdminAccount || mongoose.model('AdminAccount', adminSchema);
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@thinkbox.com').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;
const teacherPassword = process.env.THINKBOX_TEACHER_PASSWORD || process.env.ADMIN_PASSWORD;
const teacherInput = process.env.THINKBOX_TEACHERS_JSON;
const defaultTeachers = [
  { name: 'ThinkBox Teacher One', email: 'teacher.one@thinkbox.com' },
  { name: 'ThinkBox Teacher Two', email: 'teacher.two@thinkbox.com' },
  { name: 'ThinkBox Teacher Three', email: 'teacher.three@thinkbox.com' },
];

function parseTeachers() {
  if (!teacherInput) return defaultTeachers;
  const parsed = JSON.parse(teacherInput);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('THINKBOX_TEACHERS_JSON must be a non-empty JSON array.');
  return parsed.map((teacher) => ({
    name: String(teacher.name || '').trim(),
    email: String(teacher.email || '').trim().toLowerCase(),
  }));
}

async function seedAccess() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required.');
  if (!adminPassword) throw new Error('ADMIN_PASSWORD is required to seed the admin account.');
  if (!teacherPassword) throw new Error('THINKBOX_TEACHER_PASSWORD or ADMIN_PASSWORD is required for teachers.');

  await mongoose.connect(mongoUri);
  const schools = await School.find({ isActive: true }).sort({ name: 1 }).lean();
  if (schools.length === 0) throw new Error('No active schools found. Run the school seed first.');

  const adminHash = await bcryptjs.hash(adminPassword, 12);
  await AdminAccount.updateOne(
    { email: adminEmail },
    { $set: { name: 'ThinkBox Administrator', password: adminHash, role: 'admin', isActive: true } },
    { upsert: true }
  );

  const teacherHash = await bcryptjs.hash(teacherPassword, 12);
  const teachers = parseTeachers();
  const teacherRecords = [];
  for (let index = 0; index < teachers.length; index += 1) {
    const teacher = teachers[index];
    if (!teacher.name || !/^\S+@\S+\.\S+$/.test(teacher.email)) throw new Error(`Invalid teacher at index ${index}.`);
    const school = schools[index % schools.length];
    const saved = await Teacher.findOneAndUpdate(
      { email: teacher.email },
      { $set: { name: teacher.name, school: school._id, password: teacherHash, role: 'teacher', isActive: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    teacherRecords.push({ id: String(saved._id), name: saved.name, email: saved.email, school: school.name, role: 'teacher' });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    warning: 'Passwords are intentionally excluded. Use ADMIN_PASSWORD and THINKBOX_TEACHER_PASSWORD from the environment.',
    dashboards: {
      adminEditor: {
        path: '/admin/thinkbox',
        url: 'https://kaycorp.tech/admin/thinkbox',
      },
      teacherReports: {
        path: '/admin/thinkbox/reports',
        url: 'https://kaycorp.tech/admin/thinkbox/reports',
      },
    },
    admins: [{ email: adminEmail, name: 'ThinkBox Administrator', role: 'admin' }],
    teachers: teacherRecords,
  };
  const manifestPath = path.resolve(process.cwd(), '..', 'thinkbox-access-records.json');
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`ThinkBox access seed complete. Records written to ${manifestPath}`);
}

seedAccess()
  .catch((error) => {
    console.error('Unable to seed ThinkBox access:', error instanceof Error ? error.message : 'Unknown error');
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });