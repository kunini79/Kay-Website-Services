import { GoogleGenAI, Type } from "@google/genai";
import { Article, TopicPreview, Category } from "../types";
import { STATIC_TOPICS } from "../constants";
import { getOfflineTopic, toArticleFromOffline } from './offlineTopics';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Image and content cache to avoid repeated API calls
const imageCache = new Map<string, string>();
const contentCache = new Map<string, any>();

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

// Fetch Wikipedia API data
const fetchWikipediaData = async (query: string) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=extracts|pageimages&explaintext=true&exintro=true&piprop=original&format=json&origin=*`
    );
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId];
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return null;
  }
};

// Get image from Wikipedia
export const getImageUrl = async (seed: string, width = 800, height = 600): Promise<string> => {
  const cacheKey = `image_${seed}_${width}x${height}`;
  if (imageCache.has(cacheKey)) {
    console.log(`[Image Cache HIT] ${seed}`);
    return imageCache.get(cacheKey)!;
  }

  // Map friendly title to Wikipedia article name
  const wikipediaQuery = TOPIC_TO_WIKIPEDIA_MAP[seed] || seed;
  console.log(`[Image Fetch] Fetching image for: ${seed} (Wikipedia: ${wikipediaQuery})`);

  try {
    const wikiData = await fetchWikipediaData(wikipediaQuery);

    if (wikiData?.original?.source) {
      const imageUrl = wikiData.original.source;
      console.log(`[Image Found - Original] ${seed}: ${imageUrl.substring(0, 80)}...`);
      imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    }

    // Try thumbnail as fallback
    if (wikiData?.thumbnail?.source) {
      const imageUrl = wikiData.thumbnail.source;
      console.log(`[Image Found - Thumbnail] ${seed}: ${imageUrl.substring(0, 80)}...`);
      imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    }

    // Try pageimage field
    if (wikiData?.pageimage) {
      const imageUrl = `https://en.wikipedia.org/wiki/Special:FilePath/${wikiData.pageimage}`;
      console.log(`[Image Found - PageImage] ${seed}`);
      imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    }

    console.log(`[Image No Match] No image found for ${seed} (tried ${wikipediaQuery})`);
  } catch (error) {
    console.warn(`[Image Error] Failed to fetch Wikipedia image for ${seed}:`, error);
  }

  // Fallback placeholder
  const fallback = `https://placehold.co/${width}x${height}/e0e7ff/6366f1?text=${encodeURIComponent(seed)}`;
  console.log(`[Image Fallback] Using placeholder for ${seed}`);
  imageCache.set(cacheKey, fallback);
  return fallback;
};

// Fetch properly aligned images from Wikipedia
export const fetchWikimediaImage = async (
  topic: string,
  width: number = 800,
  height: number = 600
): Promise<string> => {
  return getImageUrl(topic, width, height);
};

// Get Wikipedia content and enrich with Gemini for ThinkBox structure
export const fetchArticle = async (topic: string): Promise<Article> => {
  const cacheKey = `article_${topic}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey);
  }

  try {
    // If offline, try local cache first.
    if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
      const offlineHit = await getOfflineTopic(topic);
      if (offlineHit) {
        const article = toArticleFromOffline(offlineHit);
        contentCache.set(cacheKey, article);
        return article;
      }
    }

    // Map friendly title to Wikipedia article name
    const wikipediaQuery = TOPIC_TO_WIKIPEDIA_MAP[topic] || topic;
    console.log(`[Article Fetch] Searching Wikipedia for: ${topic} (mapped to: ${wikipediaQuery})`);

    // Get Wikipedia content first
    const wikiData = await fetchWikipediaData(wikipediaQuery);
    const wikiContent = wikiData?.extract || '';

    // Check for disambiguation or too-short content
    if (!wikiContent || wikiContent.length < 200 || wikiContent.includes('may refer to:')) {
      throw new Error(`Could not find detailed information about "${topic}". Try a more specific search term.`);
    }

    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Use Gemini to structure Wikipedia content into ThinkBox format
    const model = "gemini-2.5-flash";
    const prompt = `
      Take this Wikipedia content about "${topic}" and structure it for an 8-12 year old educational app (ThinkBox).

      Wikipedia Content:
      ${wikiContent.substring(0, 2000)}

      Requirements:
      - Tone: Enthusiastic, clear, encouraging (Encarta style)
      - Structure: 3-4 chunked sections with short paragraphs (keep content concise)
      - For animals: Use headers like "Habitat & Home", "What's on the Menu?", "Family Life & Babies", "Super Senses & Body"
      - Include one "Did You Know?" fun fact from the Wikipedia content
      - Suggest 3 related topics for further learning
      - Category: Choose from [Animals, Science, Sports and Recreation, Arts, Reading and Writing, People, Places, History, Social Studies, Games and Fun]

      Return pure JSON with: title, category, intro (2-3 sentences), funFact, sections (array with subtitle and content), relatedTopics (array)
    `;

    // Create a timeout promise (40 seconds to allow for Gemini processing)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Please try again.')), 40000)
    );

    const apiPromise = ai.models.generateContent({
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
            }
          },
          required: ['title', 'category', 'intro', 'funFact', 'sections', 'relatedTopics']
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;

    const text = response.text;
    console.log('[Article] Raw Gemini response length:', text?.length || 0);
    console.log('[Article] Raw response preview:', text?.substring(0, 200));

    if (!text) throw new Error("No structured content returned");

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
    const response = await ai.models.generateContent({
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