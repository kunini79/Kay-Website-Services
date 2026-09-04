import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const sourceSchema = new mongoose.Schema({
  type: String,
  title: String,
  url: String,
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  subtitle: String,
  content: String,
}, { _id: false });

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
}, { _id: false });

const articleSchema = new mongoose.Schema({
  topicId: { type: String, unique: true },
  title: String,
  intro: String,
  funFact: String,
  sections: [sectionSchema],
  relatedTopics: [String],
  category: String,
  imageSeed: String,
  ageRange: [Number],
  source: sourceSchema,
  reviewStatus: String,
  quiz: [quizSchema],
}, { timestamps: true });

const Article = mongoose.models.ThinkBoxArticle || mongoose.model('ThinkBoxArticle', articleSchema);

const wikipedia = (title) => ({
  type: 'wikipedia',
  title,
  url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`,
});

const articles = [
  {
    topicId: 'chicken',
    title: 'Chicken',
    intro: 'A chicken is a domesticated bird kept by people around the world. Chickens are birds, even though they spend much of their time walking and scratching on the ground.',
    funFact: 'A chicken can remember many different faces and learn to recognize its keeper.',
    sections: [
      { subtitle: 'Habitat & Home', content: 'Chickens live in coops, farms, gardens, and other safe places. They use their claws to scratch the ground for seeds and small insects.' },
      { subtitle: 'Family Life & Babies', content: 'A female chicken is called a hen, a male is a rooster, and a baby is a chick. Hens lay eggs, and chicks hatch after developing inside an egg.' },
      { subtitle: 'Super Senses & Body', content: 'Chickens have feathers, wings, beaks, and strong legs. Most chickens can fly only short distances, but they can run quickly and use their wings to escape danger.' },
    ],
    relatedTopics: ['Birds', 'Eggs', 'Farm Animals'],
    category: 'Animals & Nature',
    imageSeed: 'Chicken (bird)',
    source: wikipedia('Chicken'),
  },
  {
    topicId: 'birds',
    title: 'Birds',
    intro: 'Birds are animals with feathers, wings, beaks, and lightweight skeletons. They live in nearly every environment, from hot deserts to icy oceans.',
    funFact: 'The ostrich is the largest living bird, while the bee hummingbird is one of the smallest.',
    sections: [
      { subtitle: 'Built for Flight', content: 'Many birds fly by pushing air with their wings. Hollow bones and feathers help many species stay light, while strong chest muscles power their wingbeats.' },
      { subtitle: 'Where Birds Live', content: 'Birds build nests in trees, cliffs, reeds, holes, and even on the ground. Their habitats provide food, shelter, and places to raise chicks.' },
      { subtitle: 'Bird Superpowers', content: 'Birds use sharp eyesight, songs, calls, and migration to survive. Some can navigate across continents, dive underwater, or copy sounds they hear.' },
    ],
    relatedTopics: ['Chicken', 'Bird Migration', 'Animal Homes'],
    category: 'Animals & Nature',
    imageSeed: 'Bird',
    source: wikipedia('Bird'),
  },
  {
    topicId: 'plants',
    title: 'Plants',
    intro: 'Plants are living organisms that usually make their own food using sunlight, water, and carbon dioxide. They provide food, oxygen, shelter, and materials for people and animals.',
    funFact: 'Some plants can communicate with nearby plants by releasing chemicals into the air or soil.',
    sections: [
      { subtitle: 'Roots, Stems & Leaves', content: 'Roots anchor a plant and absorb water. Stems support the plant and move materials. Leaves collect sunlight and are the main place where photosynthesis happens.' },
      { subtitle: 'How Plants Make Food', content: 'During photosynthesis, plants use light energy to turn water and carbon dioxide into sugar. Oxygen is released as part of this process.' },
      { subtitle: 'Plant Families', content: 'Plants include tiny mosses, grasses, flowering plants, shrubs, and enormous trees. Each kind has adaptations that help it survive in its environment.' },
    ],
    relatedTopics: ['Ecosystems', 'Recycling', 'Rainforest Critters'],
    category: 'Science & Space',
    imageSeed: 'Plant',
    source: wikipedia('Plant'),
  },
  {
    topicId: 'the-solar-system',
    title: 'The Solar System',
    intro: 'The Solar System is our neighborhood in space. It includes the Sun, eight planets, dwarf planets, moons, asteroids, and comets held together by gravity.',
    funFact: 'Light from the Sun takes about eight minutes to reach Earth.',
    sections: [
      { subtitle: 'The Sun', content: 'The Sun is a star at the center of the Solar System. Its gravity keeps planets in orbit, and its light and heat make life on Earth possible.' },
      { subtitle: 'Eight Worlds', content: 'The planets closest to the Sun are rocky: Mercury, Venus, Earth, and Mars. Jupiter and Saturn are gas giants, while Uranus and Neptune are ice giants.' },
      { subtitle: 'Small Worlds & Visitors', content: 'Asteroids are rocky objects, while comets contain ice and dust. When a comet travels near the Sun, it can grow a bright tail.' },
    ],
    relatedTopics: ['The Sun', 'Planets', 'Space Exploration'],
    category: 'Science & Space',
    imageSeed: 'Solar System',
    source: wikipedia('Solar System'),
  },
  {
    topicId: 'ancient-egypt',
    title: 'Ancient Egypt',
    intro: 'Ancient Egypt was a civilization that grew along the Nile River in northeastern Africa. Its people built cities, developed writing, and created art and engineering that still fascinate us today.',
    funFact: 'The ancient Egyptians used a picture-writing system called hieroglyphs.',
    sections: [
      { subtitle: 'The Nile River', content: 'The Nile provided water, fish, transport, and rich soil for farming. Its yearly floods helped farmers grow crops in an otherwise dry land.' },
      { subtitle: 'Pharaohs & Society', content: 'Pharaohs were the rulers of ancient Egypt. Farmers, craftspeople, scribes, soldiers, priests, and other workers all helped society function.' },
      { subtitle: 'Writing & Monuments', content: 'Egyptians recorded information on stone and papyrus. They built temples, tombs, and pyramids using careful planning and skilled labor.' },
    ],
    relatedTopics: ['Ancient Civilizations', 'Archaeology', 'Africa'],
    category: 'History & Civilizations',
    imageSeed: 'Ancient Egypt',
    source: wikipedia('Ancient Egypt'),
  },
];

async function seedArticles() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required to seed ThinkBox articles.');

  await mongoose.connect(mongoUri);
  const operations = articles.map((article) => ({
    updateOne: {
      filter: { topicId: article.topicId },
      update: { $set: { ...article, reviewStatus: 'published', ageRange: [8, 12] } },
      upsert: true,
    },
  }));
  const result = await Article.bulkWrite(operations, { ordered: true });
  console.log(`ThinkBox article seed complete: ${result.upsertedCount} added, ${result.modifiedCount} updated.`);
}

seedArticles()
  .catch((error) => {
    console.error('Unable to seed ThinkBox articles:', error instanceof Error ? error.message : 'Unknown error');
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });