import { GoogleGenAI, Type } from "@google/genai";
import { Article, TopicPreview, Category } from "../types";
import { STATIC_TOPICS } from "../constants";
import { getOfflineTopic, toArticleFromOffline } from './offlineTopics';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const openRouterApiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
const openRouterModel = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const nasaApiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || process.env.NASA_API_KEY || 'DEMO_KEY';

// Lazy-initialize the Gemini client so module import doesn't throw during
// static prerendering when the API key env var isn't available at build time.
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    if (!apiKey) throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set.');
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// Image and content cache to avoid repeated API calls
const imageCache = new Map<string, string>();
const imageListCache = new Map<string, string[]>();
const contentCache = new Map<string, any>();

const SPACE_TOPIC_KEYWORDS = [
  'space',
  'astronomy',
  'nasa',
  'solar system',
  'planet',
  'earth',
  'moon',
  'sun',
  'star',
  'galaxy',
  'nebula',
  'comet',
  'asteroid',
  'meteor',
  'orbit',
  'satellite',
  'telescope',
  'cosmos',
  'universe',
  'black hole',
  'milky way',
  'jupiter',
  'saturn',
  'mars',
  'venus',
  'mercury',
  'uranus',
  'neptune',
  'pluto',
  'exoplanet',
  'rover',
  'apollo',
  'iss',
  'international space station',
  'rocket',
];

const isSpaceAstronomyTopic = (topic: string): boolean => {
  const normalized = topic.toLowerCase();
  return SPACE_TOPIC_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const SPACE_QUERY_NORMALIZATION: Record<string, string> = {
  'natural satellite': 'Moon',
  'satellite': 'Moon',
  'moons': 'Moon',
};

const normalizeSpaceQuery = (query: string): string => {
  const normalized = query.trim().toLowerCase();
  return SPACE_QUERY_NORMALIZATION[normalized] || query.trim();
};

const fetchNasaImageCandidates = async (query: string, limit: number): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
    );
    if (!response.ok) return [];

    const data = await response.json();
    const items = data?.collection?.items || [];
    const results: string[] = [];
    const seen = new Set<string>();

    for (const item of items) {
      const links = Array.isArray(item?.links) ? item.links : [];
      const imageHref = links.find((link: any) => link?.href && (link?.render === 'image' || !link?.render))?.href;
      if (!imageHref || seen.has(imageHref)) continue;
      seen.add(imageHref);
      results.push(imageHref);
      if (results.length >= limit) break;
    }

    return results;
  } catch (error) {
    console.warn('[NASA Images] search error:', error);
    return [];
  }
};

const fetchBestNasaExtract = async (
  preferredQuery: string,
  fallbackQuery: string
): Promise<{ extract: string; resolvedTitle: string } | null> => {
  const normalizedPreferred = normalizeSpaceQuery(preferredQuery);
  const normalizedFallback = normalizeSpaceQuery(fallbackQuery);
  const queries = uniqueNonEmpty([
    normalizedPreferred,
    normalizedFallback,
    preferredQuery,
    fallbackQuery,
    `${normalizedPreferred} NASA`,
    `${normalizedPreferred} astronomy`,
  ]);

  let apodSnippet = '';
  try {
    const apodResponse = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(nasaApiKey)}`
    );
    if (apodResponse.ok) {
      const apodData = await apodResponse.json();
      if (apodData?.explanation) {
        apodSnippet = `Astronomy Picture of the Day (${apodData?.date || 'recent'}): ${String(apodData.explanation)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 900)}`;
      }
    }
  } catch (apodError) {
    console.warn('[NASA APOD] error:', apodError);
  }

  const snippets: string[] = [];
  let resolvedTitle = normalizedPreferred || preferredQuery;

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
      );
      if (!response.ok) continue;

      const data = await response.json();
      const items = Array.isArray(data?.collection?.items) ? data.collection.items : [];
      if (items.length > 0) {
        resolvedTitle = query;
      }

      for (const item of items.slice(0, 4)) {
        const metadata = item?.data?.[0];
        const title = metadata?.title || '';
        const description = metadata?.description || '';
        if (!title && !description) continue;
        const trimmedDescription = String(description).replace(/\s+/g, ' ').trim().slice(0, 500);
        snippets.push(`${title}: ${trimmedDescription}`.trim());
      }
    } catch (error) {
      console.warn('[NASA Content] search error:', error);
    }
  }

  const extract = uniqueNonEmpty([...snippets, apodSnippet]).join('\n\n');
  if (extract.length >= 120) {
    return {
      extract,
      resolvedTitle,
    };
  }

  return null;
};

// Map friendly topic names to Wikipedia article names for better image results
const TOPIC_TO_WIKIPEDIA_MAP: Record<string, string> = {
  // Animals
  "Mammals": "Mammal",
  "The Big Five": "Big Five game",
  "Birds": "Bird",
  "Reptiles & Amphibians": "Reptile",
  "Ocean Giants": "Whale",
  "Rainforest Critters": "Rainforest",
  "Baby Animals": "Infant",
  "Insects & Bugs": "Insect",
  "Super Fast Animals": "Cheetah",
  "Endangered Animals": "Endangered species",
  "Animal Homes": "Burrow",
  "Night Animals": "Nocturnal animal",

  // Science
  "Plants": "Plant",
  "The Human Body": "Human body",
  "The Solar System": "Solar System",
  "Weather & Climate": "Weather",
  "Rocks & Minerals": "Mineral",
  "Light & Sound": "Light",
  "Electricity": "Electricity",
  "States of Matter": "State of matter",
  "Simple Experiments": "Experiment",
  "Ecosystems": "Ecosystem",
  "Recycling": "Recycling",
  "Microorganisms": "Microorganism",

  // Sports
  "Football (Soccer)": "Association football",
  "Basketball": "Basketball",
  "Athletics": "Sport of athletics",
  "African Games": "Africa",
  "Swimming": "Swimming",
  "Fitness & Exercise": "Physical fitness",
  "Famous Athletes": "Athlete",
  "The Olympics": "Olympic Games",
  "Outdoor Adventure": "Outdoor recreation",
  "Martial Arts": "Martial arts",

  // Arts
  "Drawing & Painting": "Painting",
  "Music": "Music",
  "Dance": "Dance",
  "African Masks": "African mask",
  "Sculpture": "Sculpture",
  "Storytelling": "Storytelling",
  "Photography": "Photography",
};

const getCuratedArticleOverride = (topic: string): Article | null => {
  const normalized = topic.toLowerCase();

  if (
    normalized.includes('seven wonders') ||
    normalized.includes('7 wonders') ||
    normalized.includes('wonders of the world')
  ) {
    return {
      title: 'Seven Wonders of the Ancient World',
      category: Category.WORLD,
      intro:
        'The Seven Wonders of the Ancient World were famous human-made marvels chosen in ancient times. Today, only one still stands, but all seven helped people imagine what was possible with engineering, art, and ambition.',
      funFact:
        'The Great Pyramid of Giza is the only Ancient Wonder that still survives today.',
      sections: [
        {
          subtitle: 'The Original Seven Wonders',
          content:
            '1) Great Pyramid of Giza (Egypt)\n2) Hanging Gardens of Babylon (Iraq, traditional location)\n3) Statue of Zeus at Olympia (Greece)\n4) Temple of Artemis at Ephesus (Turkey)\n5) Mausoleum at Halicarnassus (Turkey)\n6) Colossus of Rhodes (Greece)\n7) Lighthouse of Alexandria, also called the Pharos (Egypt)',
        },
        {
          subtitle: 'Which One Still Exists?',
          content:
            'Only the Great Pyramid of Giza still exists. The others were destroyed over time by earthquakes, fires, or war.',
        },
        {
          subtitle: 'Ancient vs New Wonders',
          content:
            'People also talk about the New 7 Wonders of the World (chosen in 2007): Great Wall of China, Petra, Christ the Redeemer, Machu Picchu, Chichen Itza, Colosseum, and Taj Mahal. These are different from the ancient list.',
        },
      ],
      relatedTopics: [
        'Great Pyramid of Giza',
        'Ancient Egypt',
        'New 7 Wonders of the World',
        'Archaeology',
      ],
    };
  }

  return null;
};

// Fetch Wikipedia API data with redirect/disambiguation resolution
const fetchWikipediaData = async (query: string) => {
  try {
    // Use redirects=1 so Wikipedia auto-resolves redirects to the canonical article
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=extracts|pageimages&explaintext=true&exintro=true&piprop=original|thumbnail&pithumbsize=1200&redirects=1&format=json&origin=*`
    );
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    // pageId === '-1' means no article found
    if (pageId === '-1') return null;
    return pages[pageId];
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return null;
  }
};

const parseTopicQuery = (topic: string) => {
  const topicParts = topic.split(/\s[-–—]\s/);
  const baseTopic = topicParts[0]?.trim() || topic;
  const focusArea = topicParts.length > 1 ? topicParts.slice(1).join(' - ').trim() : null;
  return { baseTopic, focusArea };
};

const uniqueNonEmpty = (items: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const value = (raw || '').trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
};

const hasUsableWikiExtract = (extract: string) => {
  return Boolean(
    extract &&
    extract.length >= 200 &&
    !extract.toLowerCase().includes('may refer to:') &&
    !extract.toLowerCase().includes('can refer to:') &&
    !extract.toLowerCase().includes('most commonly refers to:')
  );
};

/**
 * Resolve a search query to the canonical Wikipedia article title.
 * Uses opensearch first (fast), then falls back to full-text search.
 */
const fetchWikipediaSearchTitle = async (query: string): Promise<string | null> => {
  try {
    // opensearch gives autocomplete-style results that handle common misspellings
    const osResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&namespace=0&format=json&origin=*`
    );
    if (osResponse.ok) {
      const osData = await osResponse.json();
      const titles: string[] = osData?.[1] || [];
      if (titles.length > 0) return titles[0];
    }
  } catch {
    // fall through to srsearch
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`
    );
    const data = await response.json();
    return data?.query?.search?.[0]?.title || null;
  } catch (error) {
    console.warn('[Wikipedia Search] error:', error);
    return null;
  }
};

/**
 * For a given Wikipedia article title, resolve through redirects to the
 * canonical article title (e.g. "USA" → "United States").
 */
const resolveWikipediaRedirect = async (title: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects=1&format=json&origin=*`
    );
    const data = await response.json();
    const redirects = data?.query?.redirects;
    if (Array.isArray(redirects) && redirects.length > 0) {
      return redirects[redirects.length - 1].to || title;
    }
    // Check normalized
    const normalized = data?.query?.normalized;
    if (Array.isArray(normalized) && normalized.length > 0) {
      return normalized[normalized.length - 1].to || title;
    }
    return title;
  } catch {
    return title;
  }
};

const extractBestImageFromPage = (wikiData: any): string | null => {
  if (wikiData?.original?.source) return wikiData.original.source;
  if (wikiData?.thumbnail?.source) return wikiData.thumbnail.source;
  if (wikiData?.pageimage) {
    return `https://en.wikipedia.org/wiki/Special:FilePath/${wikiData.pageimage}`;
  }
  return null;
};

// ── Wikidata image helpers (ranked fallback #1) ─────────────────────────

/**
 * Fetch Wikidata entity by Wikipedia article title and return image filenames
 * from the "image" (P18) and "logo image" (P154) properties.
 */
const fetchWikidataImages = async (articleTitle: string): Promise<string[]> => {
  try {
    // Step 1: resolve Wikipedia title → Wikidata entity ID
    const sitelinksRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageprops&ppprop=wikibase_item&redirects=1&format=json&origin=*`
    );
    if (!sitelinksRes.ok) return [];
    const sitelinksData = await sitelinksRes.json();
    const pages = sitelinksData?.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    const entityId = pages?.[pageId]?.pageprops?.wikibase_item;
    if (!entityId) return [];

    // Step 2: fetch entity claims for P18 (image) + P154 (logo)
    const claimsRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${entityId}&property=P18&format=json&origin=*`
    );
    if (!claimsRes.ok) return [];
    const claimsData = await claimsRes.json();
    const imageClaims = claimsData?.claims?.P18 || [];

    const urls: string[] = [];
    for (const claim of imageClaims) {
      const filename = claim?.mainsnak?.datavalue?.value;
      if (filename) {
        urls.push(
          `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`
        );
      }
    }
    return urls;
  } catch {
    return [];
  }
};

/**
 * Fetch images from Wikimedia Commons categories related to the article.
 * This gives us a broader pool of images than the single lead page image.
 */
const fetchWikimediaCommonsImages = async (
  articleTitle: string,
  limit: number
): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(articleTitle)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`
    );
    if (!response.ok) return [];
    const data = await response.json();
    const pages = data?.query?.pages || {};
    const urls: string[] = [];
    for (const page of Object.values(pages) as any[]) {
      const url = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
      if (url && !url.includes('.svg')) {
        urls.push(url);
      }
    }
    return urls;
  } catch {
    return [];
  }
};

/**
 * Resolve multiple image candidates through a ranked fallback chain:
 *   1. Wikipedia page image(s) — direct title + mapped title + search-resolved title
 *   2. Wikidata P18 images for the canonical article
 *   3. Wikimedia Commons category search
 *   4. Offline/cached topic thumbnail
 *
 * For space/astronomy topics, NASA images are tried first as before.
 */
const resolveImageCandidates = async (
  seed: string,
  limit: number
): Promise<string[]> => {
  // ── NASA path for space topics ──
  if (isSpaceAstronomyTopic(seed)) {
    const normalizedSeed = normalizeSpaceQuery(seed);
    const nasaQueries = uniqueNonEmpty([
      normalizedSeed,
      `${normalizedSeed} NASA`,
      `${normalizedSeed} astronomy`,
      seed,
    ]);

    const nasaImages: string[] = [];
    const seenNasa = new Set<string>();

    for (const query of nasaQueries) {
      const images = await fetchNasaImageCandidates(query, limit);
      for (const image of images) {
        if (seenNasa.has(image)) continue;
        seenNasa.add(image);
        nasaImages.push(image);
        if (nasaImages.length >= limit) return nasaImages;
      }
    }

    if (nasaImages.length > 0) return nasaImages;
    // fall through to Wikipedia/Wikidata if NASA has nothing
  }

  const { baseTopic, focusArea } = parseTopicQuery(seed);
  const mappedBase = TOPIC_TO_WIKIPEDIA_MAP[baseTopic] || baseTopic;

  // Build ordered list of candidate titles to try
  const directCandidates = uniqueNonEmpty([
    mappedBase,
    baseTopic,
    focusArea ? `${mappedBase} ${focusArea}` : null,
    focusArea ? `${baseTopic} ${focusArea}` : null,
    focusArea,
    seed,
  ]);

  const images: string[] = [];
  const seen = new Set<string>();

  const addIfUnique = (value: string | null) => {
    if (!value) return false;
    if (seen.has(value)) return false;
    seen.add(value);
    images.push(value);
    return true;
  };

  // ── Layer 1: Wikipedia page images (direct titles) ──
  let resolvedCanonicalTitle: string | null = null;
  for (const candidate of directCandidates) {
    const wikiData = await fetchWikipediaData(candidate);
    if (wikiData) {
      if (!resolvedCanonicalTitle && wikiData.title) {
        resolvedCanonicalTitle = wikiData.title;
      }
      addIfUnique(extractBestImageFromPage(wikiData));
      if (images.length >= limit) return images;
    }
  }

  // ── Layer 1b: search-resolved titles ──
  for (const candidate of directCandidates) {
    const searchTitle = await fetchWikipediaSearchTitle(candidate);
    if (!searchTitle) continue;
    if (!resolvedCanonicalTitle) resolvedCanonicalTitle = searchTitle;
    const wikiData = await fetchWikipediaData(searchTitle);
    if (wikiData) {
      addIfUnique(extractBestImageFromPage(wikiData));
      if (images.length >= limit) return images;
    }
  }

  // ── Layer 2: Wikidata P18 images ──
  const wikidataTitle = resolvedCanonicalTitle || mappedBase;
  try {
    const wdImages = await fetchWikidataImages(wikidataTitle);
    for (const url of wdImages) {
      addIfUnique(url);
      if (images.length >= limit) return images;
    }
  } catch {
    // non-critical
  }

  // ── Layer 3: Wikimedia Commons search ──
  try {
    const remaining = limit - images.length;
    if (remaining > 0) {
      const commonsImages = await fetchWikimediaCommonsImages(
        wikidataTitle,
        remaining + 2 // fetch a few extra in case of dupes
      );
      for (const url of commonsImages) {
        addIfUnique(url);
        if (images.length >= limit) return images;
      }
    }
  } catch {
    // non-critical
  }

  // ── Layer 4: offline topic thumbnail ──
  if (images.length === 0) {
    try {
      const offlineTopic = await getOfflineTopic(seed);
      if (offlineTopic?.thumbnail) {
        addIfUnique(offlineTopic.thumbnail);
      }
    } catch {
      // non-critical
    }
  }

  return images;
};

const fetchBestWikipediaExtract = async (preferredQuery: string, fallbackQuery: string) => {
  const tried = new Set<string>();

  const tryQuery = async (query: string) => {
    const normalized = query.trim();
    if (!normalized || tried.has(normalized.toLowerCase())) return null;
    tried.add(normalized.toLowerCase());

    const page = await fetchWikipediaData(normalized);
    const extract = page?.extract || '';

    // Detect disambiguation pages — try the first linked article
    if (
      extract &&
      (extract.toLowerCase().includes('may refer to:') ||
        extract.toLowerCase().includes('can refer to:') ||
        extract.toLowerCase().includes('most commonly refers to:'))
    ) {
      console.log(`[Wikipedia] Disambiguation detected for "${normalized}", resolving…`);
      // Try "<title> (topic)" pattern which is the typical disambiguation target
      const disambigTitle = await fetchWikipediaSearchTitle(normalized);
      if (disambigTitle && disambigTitle.toLowerCase() !== normalized.toLowerCase()) {
        return tryQuery(disambigTitle);
      }
      return null;
    }

    if (hasUsableWikiExtract(extract)) {
      // Resolve through redirects to get the canonical title
      const canonicalTitle = await resolveWikipediaRedirect(normalized);
      return { extract, resolvedTitle: canonicalTitle || normalized };
    }
    return null;
  };

  const directHit = await tryQuery(preferredQuery);
  if (directHit) return directHit;

  const fallbackHit = await tryQuery(fallbackQuery);
  if (fallbackHit) return fallbackHit;

  // Try opensearch + srsearch resolution for both queries
  const preferredSearchTitle = await fetchWikipediaSearchTitle(preferredQuery);
  if (preferredSearchTitle) {
    const preferredSearchHit = await tryQuery(preferredSearchTitle);
    if (preferredSearchHit) return preferredSearchHit;
  }

  const fallbackSearchTitle = await fetchWikipediaSearchTitle(fallbackQuery);
  if (fallbackSearchTitle) {
    const fallbackSearchHit = await tryQuery(fallbackSearchTitle);
    if (fallbackSearchHit) return fallbackSearchHit;
  }

  return null;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const isRateLimitOrQuotaError = (message: string): boolean => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('resource_exhausted') ||
    normalized.includes('quota') ||
    normalized.includes('rate limit') ||
    normalized.includes('429')
  );
};

const generateWithOpenRouter = async (prompt: string): Promise<string> => {
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openRouterApiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'ThinkBox',
    },
    body: JSON.stringify({
      model: openRouterModel,
      messages: [
        {
          role: 'system',
          content: 'You are generating educational encyclopedia JSON. Return valid JSON only with no markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('OpenRouter returned no structured content');
  }

  return content;
};

// Get image from Wikipedia
export const getImageUrl = async (seed: string, width = 800, height = 600): Promise<string> => {
  const cacheKey = `image_${seed}_${width}x${height}`;
  if (imageCache.has(cacheKey)) {
    console.log(`[Image Cache HIT] ${seed}`);
    return imageCache.get(cacheKey)!;
  }

  console.log(`[Image Fetch] Resolving image for: ${seed}`);

  try {
    const images = await resolveImageCandidates(seed, 1);
    if (images.length > 0) {
      const best = images[0];
      imageCache.set(cacheKey, best);
      return best;
    }

    console.log(`[Image No Match] No image found for ${seed}`);
  } catch (error) {
    console.warn(`[Image Error] Failed to fetch Wikipedia image for ${seed}:`, error);
  }

  // Fallback placeholder
  const fallback = `https://placehold.co/${width}x${height}/e0e7ff/6366f1?text=${encodeURIComponent(seed)}`;
  console.log(`[Image Fallback] Using placeholder for ${seed}`);
  imageCache.set(cacheKey, fallback);
  return fallback;
};

export const getImageUrls = async (
  seed: string,
  width = 800,
  height = 600,
  limit = 4
): Promise<string[]> => {
  const safeLimit = Math.max(1, Math.min(limit, 8));
  const cacheKey = `image_list_${seed}_${width}x${height}_${safeLimit}`;

  if (imageListCache.has(cacheKey)) {
    return imageListCache.get(cacheKey)!;
  }

  try {
    const images = await resolveImageCandidates(seed, safeLimit);
    if (images.length > 0) {
      imageListCache.set(cacheKey, images);
      const singleKey = `image_${seed}_${width}x${height}`;
      imageCache.set(singleKey, images[0]);
      return images;
    }
  } catch (error) {
    console.warn(`[Image List Error] Failed to fetch images for ${seed}:`, error);
  }

  const fallback = `https://placehold.co/${width}x${height}/e0e7ff/6366f1?text=${encodeURIComponent(seed)}`;
  const fallbackList = [fallback];
  imageListCache.set(cacheKey, fallbackList);
  return fallbackList;
};

// Fetch properly aligned images from Wikipedia
export const fetchWikimediaImage = async (
  topic: string,
  width: number = 800,
  height: number = 600
): Promise<string> => {
  return getImageUrl(topic, width, height);
};

export const fetchWikimediaImages = async (
  topic: string,
  width: number = 800,
  height: number = 600,
  limit: number = 4
): Promise<string[]> => {
  return getImageUrls(topic, width, height, limit);
};

// Get Wikipedia content and enrich with Gemini for ThinkBox structure
export const fetchArticle = async (topic: string): Promise<Article> => {
  const cacheKey = `article_${topic}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey);
  }

  try {
    const curatedArticle = getCuratedArticleOverride(topic);
    if (curatedArticle) {
      contentCache.set(cacheKey, curatedArticle);
      return curatedArticle;
    }

    // If offline, try local cache first.
    if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
      const offlineHit = await getOfflineTopic(topic);
      if (offlineHit) {
        const article = toArticleFromOffline(offlineHit);
        contentCache.set(cacheKey, article);
        return article;
      }
    }

    const { baseTopic, focusArea } = parseTopicQuery(topic);
    const isSpaceTopic = isSpaceAstronomyTopic(topic) || isSpaceAstronomyTopic(baseTopic);

    let sourceContent = '';
    let sourceName = 'Wikipedia';

    if (isSpaceTopic) {
      const normalizedTopic = normalizeSpaceQuery(topic);
      const normalizedBaseTopic = normalizeSpaceQuery(baseTopic);
      console.log(`[Article Fetch] Trying NASA source for: ${normalizedTopic}`);
      const nasaHit = await fetchBestNasaExtract(normalizedTopic, normalizedBaseTopic);
      if (nasaHit) {
        sourceContent = nasaHit.extract;
        sourceName = 'NASA';
        console.log(`[Article Fetch] NASA resolved title: ${nasaHit.resolvedTitle}`);
      } else {
        throw new Error(`NASA did not return enough information for "${normalizedBaseTopic}" right now. Please try another space topic or try again shortly.`);
      }
    }

    if (!sourceContent && !isSpaceTopic) {
      // Map friendly title to Wikipedia article name (resolve with base topic for option-queries)
      const wikipediaQuery = TOPIC_TO_WIKIPEDIA_MAP[baseTopic] || baseTopic;
      console.log(`[Article Fetch] Searching Wikipedia for: ${topic} (base: ${baseTopic}, mapped to: ${wikipediaQuery})`);

      // Get Wikipedia content with fallback resolution
      const wikiHit = await fetchBestWikipediaExtract(wikipediaQuery, baseTopic);
      if (!wikiHit) {
        throw new Error(`Could not find detailed information about "${baseTopic}". Try a more specific search term.`);
      }

      console.log(`[Article Fetch] Wikipedia resolved title: ${wikiHit.resolvedTitle}`);
      sourceContent = wikiHit.extract;
      sourceName = 'Wikipedia';
    }

    // Use Gemini to structure source content into ThinkBox format
    const model = "gemini-2.5-flash";
    const prompt = `
      Take this ${sourceName} source content about "${topic}" and structure it for an 8-12 year old educational app (ThinkBox).
      ${focusArea ? `Focus the explanation on this subtopic: "${focusArea}" while still keeping a clear overview.` : ''}

      Source Content:
      ${sourceContent.substring(0, 2000)}

      Requirements:
      - Tone: Enthusiastic, clear, encouraging (Encarta style)
      - Structure: 3-4 chunked sections with short paragraphs (keep content concise)
      - For list-style topics (e.g., "Seven Wonders", "planets", "continents"), include the complete canonical list with exact item names
      - For animals: Use headers like "Habitat & Home", "What's on the Menu?", "Family Life & Babies", "Super Senses & Body"
      - Include one "Did You Know?" fun fact from the source content
      - Suggest 3 related topics for further learning
      - Generate a 3-question multiple-choice quiz based on the article content.
      - Each question must have 4 options and the index of the correct answer (0-3).
      - Include a short explanation for the correct answer.
      - Category: Choose from [Animals, Science, Sports and Recreation, Arts, Reading and Writing, People, Places, History, Social Studies, Games and Fun]

      Return pure JSON with: title, category, intro (2-3 sentences), funFact, sections (array with subtitle and content), relatedTopics (array), quiz (array)
    `;

    let text = '';
    let geminiError: unknown = null;

    if (apiKey) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out. Please try again.')), 40000)
        );

        const apiPromise = getAI().models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                intro: { type: Type.STRING },
                funFact: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      subtitle: { type: Type.STRING },
                      content: { type: Type.STRING }
                    },
                    required: ['subtitle', 'content']
                  }
                },
                relatedTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      correctAnswer: { type: Type.NUMBER },
                      explanation: { type: Type.STRING }
                    },
                    required: ['question', 'options', 'correctAnswer', 'explanation']
                  }
                }
              },
              required: ['title', 'category', 'intro', 'funFact', 'sections', 'relatedTopics', 'quiz']
            }
          }
        });

        const response = await Promise.race([apiPromise, timeoutPromise]) as any;
        text = response.text || '';
        if (!text) throw new Error('No structured content returned from Gemini');
        console.log('[Article] Gemini response length:', text.length);
      } catch (error) {
        geminiError = error;
        console.warn('[Article] Gemini failed, attempting OpenRouter fallback:', getErrorMessage(error));
      }
    }

    if (!text && openRouterApiKey) {
      try {
        text = await generateWithOpenRouter(prompt);
        console.log('[Article] OpenRouter response length:', text.length);
      } catch (openRouterError) {
        console.error('[Article] OpenRouter fallback failed:', openRouterError);
        if (geminiError) {
          const geminiMessage = getErrorMessage(geminiError);
          if (isRateLimitOrQuotaError(geminiMessage)) {
            throw new Error(`Gemini quota reached and OpenRouter fallback failed: ${getErrorMessage(openRouterError)}`);
          }
        }
        throw openRouterError;
      }
    }

    if (!text) {
      if (geminiError) {
        throw geminiError;
      }
      throw new Error('No AI provider configured. Add NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_OPENROUTER_API_KEY.');
    }

    let article: Article;
    try {
      article = JSON.parse(text) as Article;
    } catch (parseError) {
      console.error('[Article] JSON parse error:', parseError);
      console.error('[Article] Failed to parse text:', text);
      throw new Error('Invalid JSON response from Gemini');
    }

    // Validate article structure and add defaults if missing
    if (!article.sections || !Array.isArray(article.sections)) {
      console.warn('[Article] Missing or invalid sections, adding defaults');
      article.sections = [];
    }
    if (!article.relatedTopics || !Array.isArray(article.relatedTopics)) {
      console.warn('[Article] Missing or invalid relatedTopics, adding defaults');
      article.relatedTopics = [];
    }
    if (!article.title) article.title = topic;
    if (!article.intro) article.intro = `Learn about ${topic}.`;
    if (!article.funFact) article.funFact = `${topic} is fascinating!`;

    console.log('[Article] Successfully structured:', {
      title: article.title,
      sectionsCount: article.sections.length,
      relatedTopicsCount: article.relatedTopics.length
    });

    contentCache.set(cacheKey, article);
    return article;

  } catch (error) {
    console.error("Article fetch error:", error);

    // Try offline fallback before surfacing error
    try {
      const offlineHit = await getOfflineTopic(topic);
      if (offlineHit) {
        const article = toArticleFromOffline(offlineHit);
        contentCache.set(cacheKey, article);
        return article;
      }
    } catch (offlineErr) {
      console.warn('[Article] offline fallback failed:', offlineErr);
    }

    // Re-throw the error with a helpful message for the user
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Could not load article: ${errorMessage}`);
  }
};

export const fetchSuggestions = async (category: Category): Promise<TopicPreview[]> => {
  // Use curated static topics for consistency
  if (STATIC_TOPICS[category]) {
    return new Promise(resolve => setTimeout(() => resolve(STATIC_TOPICS[category]!), 300));
  }

  if (!apiKey) {
    return [
      { title: `${category} Topic 1`, category, description: "Interesting thing." },
      { title: `${category} Topic 2`, category, description: "Another cool thing." },
      { title: `${category} Topic 3`, category, description: "Wow, look at this." },
    ];
  }

  const model = "gemini-2.5-flash";
  const prompt = `
    Suggest 4 interesting, specific topics for a children's encyclopedia in the category: "${category}".
    For each, provide a title and a very short playful description (1 sentence).
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    const items = JSON.parse(text);
    return items.map((item: any) => ({ ...item, category }));

  } catch (error) {
    console.error(error);
    return [];
  }
};