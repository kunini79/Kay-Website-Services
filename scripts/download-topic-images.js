/*
  Download best-fit images for ThinkBox topics and save credits metadata.

  Usage:
    node scripts/download-topic-images.js
    node scripts/download-topic-images.js --limit=40 --concurrency=3
    node scripts/download-topic-images.js --onlySpace=true
    node scripts/download-topic-images.js --overwrite=true
*/

const fs = require('node:fs');
const path = require('node:path');

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const cleaned = arg.replace(/^--/, '');
    const [key, value] = cleaned.split('=');
    return [key, value === undefined ? true : value];
  })
);

const ROOT = process.cwd();
const CONSTANTS_FILE = path.join(ROOT, 'app', 'system', 'constants.tsx');
const HOME_VIEW_FILE = path.join(ROOT, 'app', 'system', 'components', 'HomeView.tsx');

const OUT_DIR = path.join(ROOT, 'public', 'offline', 'topic-images');
const MANIFEST_FILE = path.join(ROOT, 'public', 'offline', 'topic-image-credits.json');

const LIMIT = Number(args.limit || 0);
const CONCURRENCY = Math.max(1, Math.min(8, Number(args.concurrency || 2)));
const OVERWRITE = args.overwrite === 'true' || args.overwrite === true;
const ONLY_SPACE = args.onlySpace === 'true' || args.onlySpace === true;
const DELAY_MS = Math.max(0, Number(args.delay || 350));
const RETRIES = Math.max(1, Math.min(8, Number(args.retries || 4)));
const BASE_BACKOFF_MS = Math.max(100, Number(args.backoff || 650));

const NASA_API_KEY = process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

const SPACE_TOPIC_KEYWORDS = [
  'space', 'astronomy', 'nasa', 'solar system', 'planet', 'earth', 'moon', 'sun', 'star',
  'galaxy', 'nebula', 'comet', 'asteroid', 'meteor', 'orbit', 'satellite', 'telescope',
  'cosmos', 'universe', 'black hole', 'milky way', 'jupiter', 'saturn', 'mars', 'venus',
  'mercury', 'uranus', 'neptune', 'pluto', 'exoplanet', 'rover', 'apollo', 'iss', 'rocket',
];

const SPACE_QUERY_NORMALIZATION = {
  'natural satellite': 'Moon',
  'satellite': 'Moon',
  'moons': 'Moon',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableStatus = (status) => status === 429 || status === 408 || status >= 500;

const fetchWithRetry = async (url, options = {}, retries = RETRIES) => {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && isRetryableStatus(response.status) && attempt < retries) {
        const retryAfter = Number(response.headers.get('retry-after') || '0');
        const waitMs = retryAfter > 0 ? retryAfter * 1000 : BASE_BACKOFF_MS * Math.pow(1.6, attempt);
        await sleep(waitMs + Math.floor(Math.random() * 150));
        attempt += 1;
        continue;
      }
      return response;
    } catch (error) {
      if (attempt >= retries) throw error;
      const waitMs = BASE_BACKOFF_MS * Math.pow(1.5, attempt);
      await sleep(waitMs + Math.floor(Math.random() * 200));
      attempt += 1;
    }
  }

  throw new Error('Request failed after retries');
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

const isSpaceTopic = (topic) => {
  const normalized = topic.toLowerCase();
  return SPACE_TOPIC_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const normalizeSpaceQuery = (query) => {
  const normalized = query.trim().toLowerCase();
  return SPACE_QUERY_NORMALIZATION[normalized] || query.trim();
};

const readFileSafe = (filePath) => {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
};

const parseQuotedValues = (input, regex) => {
  const out = [];
  let match = regex.exec(input);
  while (match) {
    out.push(match[1]);
    match = regex.exec(input);
  }
  return out;
};

const uniqueNonEmpty = (arr) => {
  const seen = new Set();
  const out = [];
  for (const value of arr) {
    const trimmed = String(value || '').trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
};

const extractTopics = () => {
  const constantsContent = readFileSafe(CONSTANTS_FILE);
  const homeViewContent = readFileSafe(HOME_VIEW_FILE);

  const staticTitles = parseQuotedValues(constantsContent, /title:\s*'([^']+)'/g);
  const optionQueries = parseQuotedValues(homeViewContent, /query:\s*'([^']+)'/g);
  const optionLabels = parseQuotedValues(homeViewContent, /label:\s*'([^']+)'/g);

  const topics = uniqueNonEmpty([...staticTitles, ...optionQueries, ...optionLabels]);
  if (ONLY_SPACE) {
    return topics.filter(isSpaceTopic);
  }
  return topics;
};

const fetchJson = async (url) => {
  const response = await fetchWithRetry(url, {
    headers: { 'User-Agent': 'Kay-Website-Services-Image-Downloader/1.0' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
};

const getUrlExtension = (url, contentType) => {
  const lowerType = String(contentType || '').toLowerCase();
  if (lowerType.includes('jpeg')) return '.jpg';
  if (lowerType.includes('png')) return '.png';
  if (lowerType.includes('webp')) return '.webp';

  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return '.jpg';
  if (cleanUrl.endsWith('.png')) return '.png';
  if (cleanUrl.endsWith('.webp')) return '.webp';
  return '.jpg';
};

const downloadImageToDisk = async (url, outBasePath) => {
  const response = await fetchWithRetry(url, {
    headers: { 'User-Agent': 'Kay-Website-Services-Image-Downloader/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Image download failed (${response.status}) for ${url}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const ext = getUrlExtension(url, contentType);
  const finalPath = `${outBasePath}${ext}`;
  const bytes = Buffer.from(await response.arrayBuffer());

  if (bytes.length < 8_000) {
    throw new Error(`Image too small for ${url}`);
  }

  fs.writeFileSync(finalPath, bytes);
  return { finalPath, ext, bytes: bytes.length };
};

const scoreCandidate = (topic, text, width = 0, height = 0) => {
  const normalizedTopic = topic.toLowerCase();
  const normalizedText = String(text || '').toLowerCase();
  const topicTokens = normalizedTopic.split(/\s+/).filter(Boolean);
  let tokenMatches = 0;
  for (const token of topicTokens) {
    if (token.length < 3) continue;
    if (normalizedText.includes(token)) tokenMatches += 1;
  }

  const avoidPenaltyWords = ['logo', 'icon', 'flag', 'seal', 'coat of arms', 'map'];
  const penalty = avoidPenaltyWords.some((word) => normalizedText.includes(word)) ? 3 : 0;
  const quality = Math.min((Number(width) * Number(height)) / 1_000_000, 8);

  return tokenMatches * 3 + quality - penalty;
};

const fetchNasaCandidate = async (topic) => {
  const normalized = normalizeSpaceQuery(topic);
  const queries = uniqueNonEmpty([
    normalized,
    `${normalized} NASA`,
    `${normalized} astronomy`,
    topic,
  ]);

  let best = null;
  for (const query of queries) {
    const data = await fetchJson(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
    );
    const items = Array.isArray(data?.collection?.items) ? data.collection.items : [];

    for (const item of items.slice(0, 15)) {
      const metadata = item?.data?.[0] || {};
      const links = Array.isArray(item?.links) ? item.links : [];
      const imageUrl = links.find((link) => link?.href && (link?.render === 'image' || !link?.render))?.href;
      if (!imageUrl) continue;

      const title = metadata.title || '';
      const description = metadata.description || '';
      const score = scoreCandidate(topic, `${title} ${description}`, 1800, 1200);

      const candidate = {
        score,
        imageUrl,
        title: title || normalized,
        source: 'NASA',
        pageUrl: item?.href || '',
        license: 'Public Domain (NASA media policy)',
        licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
        author: metadata.photographer || metadata.center || 'NASA',
        creditLine: `Image courtesy of NASA${metadata.photographer ? ` / ${metadata.photographer}` : ''}`,
      };

      if (!best || candidate.score > best.score) {
        best = candidate;
      }
    }

    if (best) break;
    await sleep(120);
  }

  return best;
};

const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, '').trim();

const fetchWikimediaCandidate = async (topic) => {
  const search = `${topic} filetype:bitmap`;
  const data = await fetchJson(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(search)}&gsrlimit=15&prop=imageinfo&iiprop=url|extmetadata|size|mime|user&iiurlwidth=1600&format=json&origin=*`
  );

  const pages = Object.values(data?.query?.pages || {});
  let best = null;

  for (const page of pages) {
    const info = page?.imageinfo?.[0];
    if (!info?.url) continue;

    const ext = (info.mime || '').toLowerCase();
    if (ext.includes('svg')) continue;

    const title = String(page.title || '').replace(/^File:/i, '');
    const meta = info.extmetadata || {};
    const artist = stripHtml(meta.Artist?.value) || info.user || 'Wikimedia Commons contributor';
    const license = stripHtml(meta.LicenseShortName?.value) || 'See Wikimedia page';
    const licenseUrl = stripHtml(meta.LicenseUrl?.value) || '';
    const credit = stripHtml(meta.Credit?.value) || '';

    const bestUrl = info.thumburl || info.url;

    const score = scoreCandidate(topic, `${title} ${credit}`, info.width, info.height);
    const candidate = {
      score,
      imageUrl: bestUrl,
      title,
      source: 'Wikimedia Commons',
      pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title).replace(/%3A/g, ':')}`,
      license,
      licenseUrl,
      author: artist,
      creditLine: credit || `Image by ${artist} via Wikimedia Commons`,
    };

    if (!best || candidate.score > best.score) {
      best = candidate;
    }
  }

  return best;
};

const getBestCandidate = async (topic) => {
  const space = isSpaceTopic(topic);

  if (space) {
    try {
      const nasa = await fetchNasaCandidate(topic);
      if (nasa) return nasa;
    } catch (error) {
      console.warn(`[${topic}] NASA lookup failed: ${error.message}`);
    }
  }

  try {
    const wiki = await fetchWikimediaCandidate(topic);
    if (wiki) return wiki;
  } catch (error) {
    console.warn(`[${topic}] Wikimedia lookup failed: ${error.message}`);
  }

  if (!space) {
    try {
      const nasaFallback = await fetchNasaCandidate(topic);
      if (nasaFallback) return nasaFallback;
    } catch (error) {
      console.warn(`[${topic}] NASA fallback failed: ${error.message}`);
    }
  }

  return null;
};

const loadExistingManifest = () => {
  if (!fs.existsSync(MANIFEST_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const main = async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const allTopics = extractTopics();
  const topics = LIMIT > 0 ? allTopics.slice(0, LIMIT) : allTopics;

  console.log(`Preparing downloads for ${topics.length} topics (concurrency=${CONCURRENCY}, onlySpace=${ONLY_SPACE})`);

  const existingManifest = loadExistingManifest();
  const existingByTopic = new Map(existingManifest.map((entry) => [String(entry.topic || '').toLowerCase(), entry]));

  const results = [];
  let cursor = 0;

  const runWorker = async (workerId) => {
    while (cursor < topics.length) {
      const index = cursor++;
      const topic = topics[index];
      const slug = slugify(topic) || `topic-${index + 1}`;
      const outBase = path.join(OUT_DIR, slug);

      if (!OVERWRITE && existingByTopic.has(topic.toLowerCase())) {
        const existing = existingByTopic.get(topic.toLowerCase());
        results.push(existing);
        console.log(`[worker ${workerId}] skip (exists): ${topic}`);
        continue;
      }

      try {
        const best = await getBestCandidate(topic);
        if (!best) {
          const failure = {
            topic,
            slug,
            status: 'failed',
            reason: 'No suitable image candidate found',
            updatedAt: new Date().toISOString(),
          };
          results.push(failure);
          console.warn(`[worker ${workerId}] no image: ${topic}`);
          continue;
        }

        const { finalPath, ext, bytes } = await downloadImageToDisk(best.imageUrl, outBase);
        const publicPath = path.relative(path.join(ROOT, 'public'), finalPath).replace(/\\/g, '/');

        const entry = {
          topic,
          slug,
          status: 'ok',
          source: best.source,
          title: best.title,
          imagePath: `/${publicPath}`,
          imageUrl: best.imageUrl,
          pageUrl: best.pageUrl,
          license: best.license,
          licenseUrl: best.licenseUrl,
          author: best.author,
          creditLine: best.creditLine,
          bytes,
          extension: ext,
          updatedAt: new Date().toISOString(),
          nasaApiKeyUsed: best.source === 'NASA' ? (NASA_API_KEY === 'DEMO_KEY' ? 'DEMO_KEY' : 'CUSTOM_KEY') : undefined,
        };

        results.push(entry);
        console.log(`[worker ${workerId}] saved ${topic} -> ${entry.imagePath} (${best.source})`);
      } catch (error) {
        const failure = {
          topic,
          slug,
          status: 'failed',
          reason: error.message,
          updatedAt: new Date().toISOString(),
        };
        results.push(failure);
        console.warn(`[worker ${workerId}] failed ${topic}: ${error.message}`);
      }

      await sleep(DELAY_MS);
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, idx) => runWorker(idx + 1)));

  const merged = [];
  const seen = new Set();

  for (const entry of [...results, ...existingManifest]) {
    const key = String(entry.topic || '').toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(entry);
  }

  merged.sort((a, b) => String(a.topic).localeCompare(String(b.topic)));
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(merged, null, 2), 'utf8');

  const okCount = merged.filter((entry) => entry.status === 'ok').length;
  const failCount = merged.filter((entry) => entry.status === 'failed').length;

  console.log(`Done. ok=${okCount}, failed=${failCount}`);
  console.log(`Manifest: ${MANIFEST_FILE}`);
  console.log(`Images dir: ${OUT_DIR}`);
};

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
