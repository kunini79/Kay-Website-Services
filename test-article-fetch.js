const { GoogleGenAI, Type } = require('@google/genai');

const apiKey = 'AIzaSyBOgvr1uNSfocvTlShhaWe3I7lPwOfzXTw';
const ai = new GoogleGenAI({ apiKey });

// Fetch Wikipedia API data
const fetchWikipediaData = async (query) => {
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

async function testArticleFetch() {
  const topic = 'The Pyramids';
  console.log(`Testing article fetch for: ${topic}\n`);

  // Step 1: Test Wikipedia fetch
  console.log('Step 1: Fetching from Wikipedia...');
  const wikiData = await fetchWikipediaData(topic);

  if (!wikiData) {
    console.error('✗ Wikipedia fetch failed');
    return;
  }

  console.log('✓ Wikipedia data received');
  console.log('  Page ID:', wikiData.pageid);
  console.log('  Title:', wikiData.title);
  console.log('  Extract length:', wikiData.extract?.length || 0);
  console.log('  Extract preview:', wikiData.extract?.substring(0, 200) + '...\n');

  const wikiContent = wikiData.extract || '';

  if (!wikiContent) {
    console.error('✗ No content from Wikipedia');
    return;
  }

  // Step 2: Test Gemini structuring
  console.log('Step 2: Structuring with Gemini...');
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Take this Wikipedia content about "${topic}" and structure it for an 8-12 year old educational app (ThinkBox).

      Wikipedia Content:
      ${wikiContent}

      Requirements:
      - Tone: Enthusiastic, clear, encouraging (Encarta style)
      - Structure: 4-5 chunked sections with short paragraphs
      - For animals: Use headers like "Habitat & Home", "What's on the Menu?", "Family Life & Babies", "Super Senses & Body"
      - Include one "Did You Know?" fun fact from the Wikipedia content
      - Suggest 3 related topics for further learning
      - Category: Choose from [Animals, Science, Sports and Recreation, Arts, Reading and Writing, People, Places, History, Social Studies, Games and Fun]

      Return pure JSON with: title, category, intro (2-3 sentences), funFact, sections (array with subtitle and content), relatedTopics (array)
    `;

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
            intro: { type: Type.STRING },
            funFact: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subtitle: { type: Type.STRING },
                  content: { type: Type.STRING }
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
    console.log('✓ Gemini response received');
    console.log('  Response length:', text.length);

    const article = JSON.parse(text);
    console.log('\n✓ Article structured successfully!');
    console.log('  Title:', article.title);
    console.log('  Category:', article.category);
    console.log('  Intro:', article.intro);
    console.log('  Fun Fact:', article.funFact);
    console.log('  Sections:', article.sections.length);
    console.log('  Related Topics:', article.relatedTopics.join(', '));

  } catch (error) {
    console.error('✗ Gemini structuring failed:', error.message);
    console.error('Full error:', error);
  }
}

testArticleFetch();
