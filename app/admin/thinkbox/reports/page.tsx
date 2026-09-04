'use client';

import { useEffect, useState } from 'react';
import { LEARNING_PATHS } from '@/app/system/services/learning';

type Report = {
  id: string;
  name: string;
  studentId?: string;
  school: string;
  xp: number;
  streak: number;
  articlesRead: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  topicsMastered: number;
  averageAccuracy: number;
  dueReviews: number;
};

type Assignment = { _id: string; title: string; pathId: string; topics: string[]; dueDate: string };

export default function ThinkBoxReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loginMode, setLoginMode] = useState<'teacher' | 'admin'>('teacher');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentPath, setAssignmentPath] = useState<string>(LEARNING_PATHS[0].id);
  const [assignmentDueDate, setAssignmentDueDate] = useState('');

  const loadReports = async () => {
    const response = await fetch('/api/admin/thinkbox-reports', { cache: 'no-store' });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Unable to load reports');
    setReports(data.reports || []);
    const assignmentResponse = await fetch('/api/admin/thinkbox-assignments', { cache: 'no-store' });
    if (assignmentResponse.ok) setAssignments((await assignmentResponse.json()).assignments || []);
  };

  const createAssignment = async (event: React.FormEvent) => {
    event.preventDefault();
    const path = LEARNING_PATHS.find((item) => item.id === assignmentPath) || LEARNING_PATHS[0];
    const response = await fetch('/api/admin/thinkbox-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: assignmentTitle, pathId: path.id, topics: path.topics, dueDate: assignmentDueDate }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) { setError(data?.message || 'Unable to create assignment'); return; }
    setAssignmentTitle('');
    setAssignmentDueDate('');
    await loadReports();
  };

  useEffect(() => {
    loadReports().then(() => setAuthenticated(true)).catch(() => undefined);
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch(loginMode === 'teacher' ? '/api/login' : '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginMode === 'teacher' ? { loginMethod: 'email', email, password } : { password }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.message || 'Invalid password');
      return;
    }
    setPassword('');
    setEmail('');
    setAuthenticated(true);
    await loadReports();
  };

  if (!authenticated) {
    return <main className="min-h-screen bg-[#0f1115] px-4 py-16 text-white"><form onSubmit={login} className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#171b21] p-8"><p className="text-xs uppercase tracking-[0.3em] text-[#BBFD6A]">ThinkBox Reports</p><h1 className="mt-4 text-4xl font-semibold">Teacher access</h1><div className="mt-5 flex gap-2"><button type="button" onClick={() => setLoginMode('teacher')} className={`rounded-full px-3 py-2 text-xs ${loginMode === 'teacher' ? 'bg-[#BBFD6A] text-black' : 'border border-white/15'}`}>Teacher</button><button type="button" onClick={() => setLoginMode('admin')} className={`rounded-full px-3 py-2 text-xs ${loginMode === 'admin' ? 'bg-[#BBFD6A] text-black' : 'border border-white/15'}`}>Admin</button></div>{error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}{loginMode === 'teacher' && <input className="mt-6 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Teacher email" />}<input className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={loginMode === 'teacher' ? 'Teacher password' : 'Admin password'} /><button className="mt-4 w-full rounded-full bg-[#BBFD6A] px-5 py-3 font-semibold text-black">View reports</button></form></main>;
  }

  return <main className="min-h-screen bg-[#0f1115] px-4 py-8 text-white"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.3em] text-[#BBFD6A]">ThinkBox Reports</p><h1 className="mt-3 text-4xl font-semibold">Learner progress</h1><p className="mt-2 text-sm text-white/60">Review activity, mastery, and topics due for practice.</p></div><button onClick={() => window.print()} className="rounded-full border border-white/15 px-4 py-2 text-sm">Print report</button></div><section className="mb-6 rounded-3xl border border-white/10 bg-[#171b21] p-5"><h2 className="text-xl font-semibold">Assign a learning path</h2><form onSubmit={createAssignment} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_180px_auto]"><input required value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder="Assignment title" className="rounded-xl border border-white/10 bg-black/20 p-3 text-white" /><select value={assignmentPath} onChange={(event) => setAssignmentPath(event.target.value)} className="rounded-xl border border-white/10 bg-black/20 p-3 text-white">{LEARNING_PATHS.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}</select><input required type="date" value={assignmentDueDate} onChange={(event) => setAssignmentDueDate(event.target.value)} className="rounded-xl border border-white/10 bg-black/20 p-3 text-white" /><button className="rounded-full bg-[#BBFD6A] px-5 py-3 font-semibold text-black">Assign</button></form><div className="mt-4 grid gap-2 md:grid-cols-3">{assignments.map((assignment) => <div key={assignment._id} className="rounded-xl border border-white/10 p-3"><strong>{assignment.title}</strong><span className="block text-xs text-white/50">Due {new Date(assignment.dueDate).toLocaleDateString()}</span></div>)}</div></section><div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#171b21]"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50"><tr><th className="p-4">Learner</th><th className="p-4">School</th><th className="p-4">Read</th><th className="p-4">Quizzes</th><th className="p-4">Accuracy</th><th className="p-4">Mastered</th><th className="p-4">Due</th><th className="p-4">Streak</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id} className="border-b border-white/5"><td className="p-4"><strong>{report.name}</strong><span className="block text-xs text-white/45">{report.studentId || 'No student ID'}</span></td><td className="p-4 text-white/65">{report.school}</td><td className="p-4">{report.articlesRead}</td><td className="p-4">{report.quizzesCompleted}<span className="block text-xs text-white/45">{report.perfectQuizzes} perfect</span></td><td className="p-4">{report.averageAccuracy}%</td><td className="p-4">{report.topicsMastered}</td><td className={`p-4 font-semibold ${report.dueReviews > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>{report.dueReviews}</td><td className="p-4">{report.streak}d</td></tr>)}</tbody></table>{reports.length === 0 && <p className="p-8 text-center text-white/55">No learner reports yet.</p>}</div></div></main>;
}