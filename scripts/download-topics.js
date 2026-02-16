/*
  Fetch ~N random Wikipedia summaries for offline use.
  Usage:
    node scripts/download-topics.js --limit=10000 --images=false
    node scripts/download-topics.js --limit=12000 --images=true
*/

const fs = require('node:fs');
const path = require('node:path');
const { setTimeout: sleep } = require('node:timers/promises');

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const cleaned = arg.replace(/^--/, '');
    const [key, value] = cleaned.split('=');
    return [key, value === undefined ? true : value];
  })
);

const LIMIT = Number(args.limit || 10000);
const INCLUDE_IMAGES = args.images === 'true' || args.images === true;
// Lower worker count by default to avoid rate limits; can be overridden.
const WORKERS = Math.min(8, Number(args.workers || 2));
const PER_REQUEST_DELAY_MS = Number(args.delay || 500);
const BASE_BACKOFF_MS = Number(args.backoff || 1200);
const MAX_BACKOFF_MS = Number(args.maxBackoff || 8000);
const MAX_RATE_WAIT_MS = Number(args.maxRateWait || 30000);
const OUT_DIR = path.join(process.cwd(), 'public', 'offline');
const OUT_FILE = path.join(OUT_DIR, 'topics.json');

const seen = new Set();
const topics = [];

async function fetchSummary() {
  const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after') || '0');
    const delay = retryAfter > 0 ? retryAfter * 1000 : 0;
    const err = new Error('rate limited');
    err.code = 'RATE';
    err.retryAfter = delay;
    throw err;
  }
  if (!res.ok) throw new Error(`summary status ${res.status}`);
  return res.json();
}

async function fetchImageDataUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await res.arrayBuffer());
    // Keep thumbnails small; skip if file is unexpectedly large.
    if (buffer.length > 150_000) return null;
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    return null;
  }
}

async function worker(id) {
  let backoff = BASE_BACKOFF_MS;
  while (topics.length < LIMIT) {
    try {
      const summary = await fetchSummary();
      backoff = BASE_BACKOFF_MS;
      if (!summary?.title || seen.has(summary.title)) continue;

      const record = {
        id: summary.pageid,
        title: summary.title,
        summary: summary.extract || '',
        url: summary.content_urls?.desktop?.page || '',
        thumbnail: null,
      };

      if (INCLUDE_IMAGES && summary.thumbnail?.source) {
        record.thumbnail = await fetchImageDataUrl(summary.thumbnail.source);
      }

      seen.add(record.title);
      topics.push(record);

      if (topics.length % 100 === 0) {
        console.log(`[worker ${id}] collected ${topics.length}/${LIMIT}`);
      }

      // Throttle to reduce rate-limit hits
      await sleep(PER_REQUEST_DELAY_MS);
    } catch (err) {
      if (err?.code === 'RATE') {
        const jitter = Math.floor(Math.random() * 400);
        const waitMs = Math.min(MAX_RATE_WAIT_MS, Math.min(MAX_BACKOFF_MS, backoff) + jitter + (err.retryAfter || 0));
        backoff = Math.min(MAX_BACKOFF_MS, backoff * 1.6 + 200);
        console.warn(`[worker ${id}] rate-limited; waiting ${waitMs}ms before retry`);
        await sleep(waitMs);
      } else {
        console.warn(`[worker ${id}] retrying after error:`, err.message);
        const waitMs = err.message && err.message.includes('rate-limit')
          ? Math.max(PER_REQUEST_DELAY_MS * 3, 1500)
          : backoff;
        await sleep(waitMs);
        backoff = Math.min(MAX_BACKOFF_MS, backoff * 1.3 + 200);
      }
    }
  }
}

async function main() {
  console.log(`Starting fetch: limit=${LIMIT}, images=${INCLUDE_IMAGES}, workers=${WORKERS}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const workerIds = Array.from({ length: WORKERS }, (_, i) => i + 1);
  await Promise.all(workerIds.map((id) => worker(id)));

  const trimmed = topics.slice(0, LIMIT);
  fs.writeFileSync(OUT_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  console.log(`Saved ${trimmed.length} topics to ${OUT_FILE}`);

  const approxSizeMb = Buffer.byteLength(JSON.stringify(trimmed)) / (1024 * 1024);
  console.log(`Approx JSON size: ${approxSizeMb.toFixed(2)} MB`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
