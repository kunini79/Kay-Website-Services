import { GoogleGenAI, Type } from "@google/genai";
import { Article, TopicPreview, Category } from "../types";
import { STATIC_TOPICS } from "../constants";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate a relevant image URL based on the topic
export const getImageUrl = (seed: string, width = 800, height = 600) => {
  // Create a mapping of keywords to curated image categories
  const seedLower = seed.toLowerCase();
  
  // Map to specific Picsum photo IDs that match common topics
  const categoryMaps: { [key: string]: number[] } = {
    // Nature & Animals (green, wildlife, landscapes)
    'animal': [1024, 1025, 237, 659, 718, 783, 1074, 1084],
    'lion': [1024, 1025],
    'cat': [1074, 1084],
    'dog': [237, 659],
    'bird': [718, 783],
    'ocean': [1018, 147, 152, 164, 177, 197],
    'forest': [975, 901, 1002, 1015],
    
    // Science (tech, lab, space)
    'science': [2, 60, 180, 195, 257],
    'space': [996, 1005, 1006],
    'robot': [2, 257],
    
    // Sports (action, equipment)
    'sport': [175, 244, 367, 400, 427],
    'ball': [175, 244],
    
    // Arts (colors, creativity)
    'art': [102, 163, 201, 217, 225],
    'paint': [102, 163],
    'music': [153, 225],
    
    // Reading & People
    'book': [24, 225, 356],
    'people': [64, 65, 91, 200, 338, 548],
    'child': [64, 200, 338],
    
    // Places & History
    'city': [15, 101, 111, 206, 213],
    'building': [15, 206, 213],
    'history': [193, 235, 274],
    
    // General education
    'learn': [24, 60, 219],
    'school': [24, 219],
  };
  
  // Find matching category
  let imageIds: number[] = [];
  for (const [keyword, ids] of Object.entries(categoryMaps)) {
    if (seedLower.includes(keyword)) {
      imageIds = ids;
      break;
    }
  }
  
  // If no match, use hash-based selection from curated general set
  if (imageIds.length === 0) {
    const generalIds = [3, 10, 20, 28, 42, 48, 56, 82, 103, 119, 146, 169, 188, 250, 292, 326, 365, 403, 431, 478];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % generalIds.length;
    imageIds = [generalIds[index]];
  }
  
  // Pick one from the matched category
  const selectedId = imageIds[Math.floor(Math.random() * imageIds.length)];
  
  return `https://picsum.photos/id/${selectedId}/${width}/${height}`;
};

export const fetchArticle = async (topic: string): Promise<Article> => {
  if (!apiKey) {
    // Fallback for demo if no API key is present
    return new Promise(resolve => setTimeout(() => resolve({
      title: topic,
      category: Category.ANIMALS,
      intro: `This is a demo article about ${topic}. Connect your Gemini API Key to see real magic!`,
      funFact: "Did you know? This is placeholder data.",
      sections: [
        { subtitle: "Where do they live?", content: "They live in the demo forest." },
        { subtitle: "What do they eat?", content: "Pixels and data." }
      ],
      relatedTopics: ["Space", "Cats", "Robots"]
    }), 1500));
  }

  const model = "gemini-3-flash-preview";
  
  // Enhanced prompt to support specific Animal Template
  const prompt = `
    Write a fun, educational encyclopedia article for an 8-12 year old child about "${topic}".
    
    Guidelines:
    - Tone: Enthusiastic, clear, encouraging (Encarta style).
    - Structure: Chunked information, no walls of text.
    - Fun Fact: Include one surprising "Did You Know?" fact.
    - Related Topics: Suggest 3 other topics a kid might like after this.
    - Category: Choose one best fit from [Animals, Science, Sports and Recreation, Arts, Reading and Writing, People, Places, History, Social Studies, Games and Fun].

    SPECIAL INSTRUCTION FOR ANIMALS:
    If the topic is a specific animal (e.g., Lion, Frog), you MUST use these section headers:
    1. "Habitat & Home" (Where do they live?)
    2. "What's on the Menu?" (Diet)
    3. "Family Life & Babies" (Social structure & Life Cycle)
    4. "Super Senses & Body" (Physical features)
    
    If the topic is a GROUP (e.g., Mammals, Reptiles), explain what makes them special, give examples, and where they are found.

    Return pure JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            intro: { type: Type.STRING, description: "A 2-3 sentence engaging summary." },
            funFact: { type: Type.STRING, description: "A surprising fact." },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subtitle: { type: Type.STRING },
                  content: { type: Type.STRING, description: "2-3 paragraphs max." }
                }
              }
            },
            relatedTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as Article;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Oops! Our encyclopedia brain is taking a nap. Try again later!");
  }
};

export const fetchSuggestions = async (category: Category): Promise<TopicPreview[]> => {
  // 1. Use curated static topics if available (Enforce structure for Animals)
  if (STATIC_TOPICS[category]) {
    // Simulate a small delay for consistency
    return new Promise(resolve => setTimeout(() => resolve(STATIC_TOPICS[category]!), 300));
  }

  if (!apiKey) {
    return [
      { title: `${category} Topic 1`, category, description: "Interesting thing." },
      { title: `${category} Topic 2`, category, description: "Another cool thing." },
      { title: `${category} Topic 3`, category, description: "Wow, look at this." },
    ];
  }

  const model = "gemini-3-flash-preview";
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
              category: { type: Type.STRING } // Just to fit the type, though we know it
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    const items = JSON.parse(text);
    // Ensure category is set correctly
    return items.map((item: any) => ({ ...item, category })); 

  } catch (error) {
    console.error(error);
    return [];
  }
}