// Cloud sync utility for ThinkBox progress

export async function fetchCloudProgress(userId: string) {
  const res = await fetch('/api/user/progress', {
    method: 'GET',
    headers: { 'x-user-id': userId },
  });
  if (!res.ok) throw new Error('Failed to fetch progress');
  return await res.json();
}

export async function saveCloudProgress(userId: string, progress: any) {
  const res = await fetch('/api/user/progress', {
    method: 'POST',
    headers: { 'x-user-id': userId, 'Content-Type': 'application/json' },
    body: JSON.stringify(progress),
  });
  if (!res.ok) throw new Error('Failed to save progress');
  return await res.json();
}
