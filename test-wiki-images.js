async function testWikipediaImages() {
  const topics = ['Lion', 'Solar System', 'Egyptian pyramids'];

  for (const topic of topics) {
    console.log(`\n=== Testing: ${topic} ===`);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(topic)}&prop=extracts|pageimages&explaintext=true&exintro=true&piprop=original&format=json&origin=*`
      );
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      console.log('Page ID:', pageId);
      console.log('Title:', page.title);
      console.log('Has extract:', !!page.extract);
      console.log('Extract length:', page.extract?.length || 0);
      console.log('\nPage structure:', JSON.stringify(page, null, 2).substring(0, 500));
      console.log('\nImage URL:', page.original?.source || page.thumbnail?.source || 'NO IMAGE FOUND');

    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

testWikipediaImages();
