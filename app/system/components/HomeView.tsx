import React, { useEffect, useMemo, useState } from 'react';
import { CATEGORY_CONFIG, STATIC_TOPICS, SUBCATEGORIES_DATA } from '../constants';
import { Category, ReadHistoryItem, TopicPreview } from '../types';
import { ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onTopicClick: (topic: string) => void;
  searchFilter: string;
  exploredCategories: Set<string>;
  onCategoryChange?: (category: Category) => void;
  readHistory?: ReadHistoryItem[];
  onCategoryClick?: (category: Category, subcategoryId?: string) => void;
}

type TopicOption = {
  label: string;
  query: string;
  meta?: string;
};

type PublishedTopic = {
  topicId: string;
  title: string;
  category: string;
  intro: string;
};

const CATEGORY_TOPIC_TO_SUBCATEGORY_ID: Partial<Record<Category, Record<string, string>>> = {
  [Category.ANIMALS]: {
    Mammals: 'mammals',
    'The Big Five': 'kinds',
    Birds: 'birds',
    'Reptiles & Amphibians': 'reptiles',
    'Ocean Giants': 'sea',
    'Rainforest Critters': 'kinds',
    'Baby Animals': 'how',
    'Insects & Bugs': 'insects',
    'Super Fast Animals': 'how',
    'Endangered Animals': 'how',
    'Animal Homes': 'how',
    'Night Animals': 'how',
  },
  [Category.SCIENCE]: {
    Plants: 'plants',
    'The Human Body': 'body',
    'The Solar System': 'space',
    'Weather & Climate': 'earth',
    'Rocks & Minerals': 'earth',
    'Light & Sound': 'physics',
    Electricity: 'physics',
    'States of Matter': 'physics',
    'Simple Experiments': 'experiments',
    Ecosystems: 'earth',
    Recycling: 'earth',
    Microorganisms: 'chemistry',
  },
  [Category.HISTORY]: {
    'Ancient Civilizations': 'ancient',
    'African Kingdoms': 'africa',
    'Early Humans': 'ancient',
    Explorers: 'explorers',
    Inventions: 'inventions',
    'Nigerian History': 'nigeria',
    Timelines: 'modern',
    'Castles & Pyramids': 'ancient',
  },
  [Category.PEOPLE]: {
    'African Heroes': 'african',
    Inventors: 'scientists',
    'World Leaders': 'leaders',
    'Everyday Heroes': 'leaders',
    'Famous Scientists': 'scientists',
    'Artists & Musicians': 'artists',
    Careers: 'scientists',
    'Family & Traditions': 'african',
  },
  [Category.WORLD]: {
    Continents: 'africa',
    Africa: 'africa',
    Nigeria: 'africa',
    'Natural Wonders': 'oceans',
    Oceans: 'oceans',
    'Famous Cities': 'europe',
    Maps: 'cultures',
    'Deserts & Forests': 'africa',
  },
  [Category.ARTS]: {
    'Drawing & Painting': 'visual',
    Music: 'music',
    Dance: 'dance',
    'African Masks': 'crafts',
    Sculpture: 'visual',
    Storytelling: 'theatre',
    Photography: 'visual',
    'Fashion Design': 'crafts',
    'Famous Artists': 'visual',
  },
  [Category.SPORTS]: {
    'Football (Soccer)': 'football',
    Basketball: 'team',
    Athletics: 'individual',
    Swimming: 'individual',
    'Famous Athletes': 'olympics',
    'The Olympics': 'olympics',
    'Outdoor Adventure': 'games',
    'Martial Arts': 'individual',
  },
  [Category.TECH]: {
    'How Computers Work': 'computers',
    'The Internet': 'internet',
    'Coding Basics': 'coding',
    Robotics: 'inventions',
    'AI & Machine Learning': 'future',
    'Video Games': 'coding',
    'Space Technology': 'future',
    'Future Tech': 'future',
  },
  [Category.READING]: {
    Folktales: 'stories',
    'African Proverbs': 'proverbs',
    Poetry: 'writing',
    'Creative Writing': 'writing',
    'Myths & Legends': 'stories',
    'Vocabulary Fun': 'writing',
    'Great Books': 'authors',
  },
};

const ROUTING_STOP_WORDS = new Set(['the', 'and', 'of', 'for', 'to', 'in', 'a', 'an']);

const tokenizeForRouting = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0 && !ROUTING_STOP_WORDS.has(token));

const getSharedTokenCount = (sourceTokens: string[], targetTokens: string[]) => {
  if (sourceTokens.length === 0 || targetTokens.length === 0) {
    return 0;
  }

  const targetTokenSet = new Set(targetTokens);
  return sourceTokens.reduce((count, token) => {
    return targetTokenSet.has(token) ? count + 1 : count;
  }, 0);
};

const inferSubcategoryId = (category: Category, topicTitle: string) => {
  const subcategories = SUBCATEGORIES_DATA[category] || [];
  if (subcategories.length === 0) {
    return undefined;
  }

  const topicLower = topicTitle.toLowerCase();
  const topicTokens = tokenizeForRouting(topicTitle);
  let bestMatchId: string | undefined;
  let bestScore = -1;

  subcategories.forEach((subcategory) => {
    let score = 0;
    const subcategoryTitleLower = subcategory.title.toLowerCase();
    const subcategoryDescriptionLower = subcategory.description.toLowerCase();
    const subcategoryTitleTokens = tokenizeForRouting(subcategory.title);
    const subcategoryDescriptionTokens = tokenizeForRouting(subcategory.description);

    if (subcategoryTitleLower === topicLower) {
      score += 20;
    }

    if (subcategoryTitleLower.includes(topicLower) || topicLower.includes(subcategoryTitleLower)) {
      score += 12;
    }

    score += getSharedTokenCount(topicTokens, subcategoryTitleTokens) * 6;
    score += getSharedTokenCount(topicTokens, subcategoryDescriptionTokens) * 2;

    subcategory.topics.forEach((subcategoryTopic) => {
      const subcategoryTopicLower = subcategoryTopic.toLowerCase();

      if (subcategoryTopicLower === topicLower) {
        score += 30;
        return;
      }

      if (subcategoryTopicLower.includes(topicLower) || topicLower.includes(subcategoryTopicLower)) {
        score += 10;
      }

      score += getSharedTokenCount(topicTokens, tokenizeForRouting(subcategoryTopic)) * 3;
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatchId = subcategory.id;
    }
  });

  return bestMatchId || subcategories[0]?.id;
};

export const HomeView: React.FC<HomeViewProps> = ({
  onTopicClick,
  searchFilter,
  exploredCategories,
  onCategoryChange,
  onCategoryClick,
}) => {
  const orderedCategories: Category[] = [
    Category.ANIMALS,
    Category.SCIENCE,
    Category.SPORTS,
    Category.ARTS,
    Category.READING,
    Category.PEOPLE,
    Category.WORLD,
    Category.HISTORY,
    Category.TECH,
  ];

  const leftCategories = orderedCategories.slice(0, 5);
  const rightCategories = orderedCategories.slice(5);

  const categoryDisplayNames: Record<Category, string> = {
    [Category.ANIMALS]: 'Animals & Nature',
    [Category.SCIENCE]: 'Science & Space',
    [Category.SPORTS]: 'Sports & Games',
    [Category.ARTS]: 'Arts & Music',
    [Category.READING]: 'Reading & Stories',
    [Category.PEOPLE]: 'People & Leaders',
    [Category.WORLD]: 'Places & Cultures',
    [Category.HISTORY]: 'History & Civilizations',
    [Category.TECH]: 'Technology & Innovation',
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ANIMALS);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [publishedTopics, setPublishedTopics] = useState<PublishedTopic[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/system/articles', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data?.articles)) {
          setPublishedTopics(data.articles);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const normalizedQuery = searchFilter.trim().toLowerCase();

  const getCategoryTopics = (cat: Category) => {
    const staticTopics = (STATIC_TOPICS[cat] || []) as TopicPreview[];
    const published = publishedTopics
      .filter((topic) => topic.category === cat)
      .map((topic) => ({
        title: topic.title,
        category: topic.category,
        description: topic.intro,
      }));
    const seen = new Set<string>();
    return [...staticTopics, ...published].filter((topic) => {
      const key = topic.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const isCategoryMatch = (cat: Category) => {
    if (!normalizedQuery) return true;
    if (
      cat.toLowerCase().includes(normalizedQuery) ||
      CATEGORY_CONFIG[cat].description.toLowerCase().includes(normalizedQuery)
    ) {
      return true;
    }

    return getCategoryTopics(cat).some(
      (topic) =>
        topic.title.toLowerCase().includes(normalizedQuery) ||
        topic.description.toLowerCase().includes(normalizedQuery)
    );
  };

  const filteredTopics = useMemo(() => {
    const topics = getCategoryTopics(selectedCategory);
    if (!normalizedQuery) return topics;
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(normalizedQuery) ||
        topic.description.toLowerCase().includes(normalizedQuery)
    );
  }, [selectedCategory, normalizedQuery]);

  useEffect(() => {
    setSelectedTopic(null);
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedTopic) return;
    if (!filteredTopics.some((topic) => topic.title === selectedTopic)) {
      setSelectedTopic(null);
    }
  }, [filteredTopics, selectedTopic]);

  const topicOptionOverrides: Partial<Record<string, TopicOption[]>> = {
    'African Heroes': [
      { label: 'Nelson Mandela', query: 'Nelson Mandela', meta: 'South Africa' },
      { label: 'Queen Amina', query: 'Queen Amina', meta: 'Zazzau (Zaria)' },
      { label: 'Mansa Musa', query: 'Mansa Musa', meta: 'Mali Empire' },
      { label: 'Wangari Maathai', query: 'Wangari Maathai', meta: 'Kenya' },
      { label: 'Nnamdi Azikiwe', query: 'Nnamdi Azikiwe', meta: 'Nigeria' },
      { label: 'Thomas Sankara', query: 'Thomas Sankara', meta: 'Burkina Faso' },
    ],
    Inventors: [
      { label: 'Thomas Edison', query: 'Thomas Edison' },
      { label: 'Nikola Tesla', query: 'Nikola Tesla' },
      { label: 'Garrett Morgan', query: 'Garrett Morgan' },
      { label: 'Marie Curie', query: 'Marie Curie' },
      { label: 'Alexander Graham Bell', query: 'Alexander Graham Bell' },
      { label: 'Ibn al-Haytham', query: 'Ibn al-Haytham' },
    ],
    'Famous Scientists': [
      { label: 'Albert Einstein', query: 'Albert Einstein' },
      { label: 'Isaac Newton', query: 'Isaac Newton' },
      { label: 'Rosalind Franklin', query: 'Rosalind Franklin' },
      { label: 'Galileo Galilei', query: 'Galileo Galilei' },
      { label: 'Katherine Johnson', query: 'Katherine Johnson' },
      { label: 'Charles Darwin', query: 'Charles Darwin' },
    ],
    'World Leaders': [
      { label: 'Abraham Lincoln', query: 'Abraham Lincoln' },
      { label: 'Julius Nyerere', query: 'Julius Nyerere' },
      { label: 'Mahatma Gandhi', query: 'Mahatma Gandhi' },
      { label: 'Winston Churchill', query: 'Winston Churchill' },
      { label: 'Ellen Johnson Sirleaf', query: 'Ellen Johnson Sirleaf' },
      { label: 'Barack Obama', query: 'Barack Obama' },
    ],
    'Everyday Heroes': [
      { label: 'Nurses and Midwives', query: 'Nurse', meta: 'Healthcare' },
      { label: 'Firefighters', query: 'Firefighter', meta: 'Emergency service' },
      { label: 'Teachers', query: 'Teacher', meta: 'Education' },
      { label: 'Farmers', query: 'Farmer', meta: 'Food and agriculture' },
      { label: 'Rescue Workers', query: 'Search and rescue', meta: 'Safety and rescue' },
      { label: 'Community Volunteers', query: 'Volunteering', meta: 'Community impact' },
    ],
    'Artists & Musicians': [
      { label: 'Fela Kuti', query: 'Fela Kuti', meta: 'Afrobeat pioneer' },
      { label: 'Miriam Makeba', query: 'Miriam Makeba', meta: 'Singer and activist' },
      { label: 'Vincent van Gogh', query: 'Vincent van Gogh', meta: 'Painter' },
      { label: 'Pablo Picasso', query: 'Pablo Picasso', meta: 'Modern art' },
      { label: 'Michael Jackson', query: 'Michael Jackson', meta: 'Pop music' },
      { label: 'Ludwig van Beethoven', query: 'Ludwig van Beethoven', meta: 'Classical music' },
    ],
    Careers: [
      { label: 'Doctor', query: 'Physician' },
      { label: 'Software Engineer', query: 'Software engineer' },
      { label: 'Architect', query: 'Architect' },
      { label: 'Pilot', query: 'Pilot (aeronautics)' },
      { label: 'Journalist', query: 'Journalist' },
      { label: 'Marine Biologist', query: 'Marine biology' },
    ],
    'Family & Traditions': [
      { label: 'Naming Ceremonies', query: 'Naming ceremony' },
      { label: 'Wedding Traditions', query: 'Wedding' },
      { label: 'Festivals', query: 'Festival' },
      { label: 'Storytelling Nights', query: 'Oral tradition' },
      { label: 'Traditional Clothing', query: 'Traditional dress' },
      { label: 'Respect for Elders', query: 'Filial piety' },
    ],
    'Ancient Civilizations': [
      { label: 'Ancient Egypt', query: 'Ancient Egypt' },
      { label: 'Mesopotamia', query: 'Mesopotamia' },
      { label: 'Ancient Greece', query: 'Ancient Greece' },
      { label: 'Ancient Rome', query: 'Ancient Rome' },
      { label: 'Indus Valley Civilization', query: 'Indus Valley Civilisation' },
      { label: 'Maya Civilization', query: 'Maya civilization' },
    ],
    'African Kingdoms': [
      { label: 'Mali Empire', query: 'Mali Empire' },
      { label: 'Songhai Empire', query: 'Songhai Empire' },
      { label: 'Kingdom of Benin', query: 'Kingdom of Benin' },
      { label: 'Kingdom of Kush', query: 'Kingdom of Kush' },
      { label: 'Great Zimbabwe', query: 'Great Zimbabwe' },
      { label: 'Oyo Empire', query: 'Oyo Empire' },
    ],
    'Early Humans': [
      { label: 'Australopithecus', query: 'Australopithecus' },
      { label: 'Homo habilis', query: 'Homo habilis' },
      { label: 'Homo erectus', query: 'Homo erectus' },
      { label: 'Neanderthals', query: 'Neanderthal' },
      { label: 'Stone Age Tools', query: 'Stone tool' },
      { label: 'Cave Paintings', query: 'Cave painting' },
    ],
    Explorers: [
      { label: 'Ibn Battuta', query: 'Ibn Battuta' },
      { label: 'Zheng He', query: 'Zheng He' },
      { label: 'Christopher Columbus', query: 'Christopher Columbus' },
      { label: 'Mungo Park', query: 'Mungo Park' },
      { label: 'Roald Amundsen', query: 'Roald Amundsen' },
      { label: 'Neil Armstrong', query: 'Neil Armstrong' },
    ],
    Inventions: [
      { label: 'Wheel', query: 'Wheel' },
      { label: 'Printing Press', query: 'Printing press' },
      { label: 'Compass', query: 'Compass' },
      { label: 'Steam Engine', query: 'Steam engine' },
      { label: 'Telephone', query: 'Telephone' },
      { label: 'Internet', query: 'Internet' },
    ],
    'Nigerian History': [
      { label: 'Nok Culture', query: 'Nok culture' },
      { label: 'Benin Kingdom', query: 'Kingdom of Benin' },
      { label: 'Sokoto Caliphate', query: 'Sokoto Caliphate' },
      { label: 'Colonial Nigeria', query: 'Colonial Nigeria' },
      { label: 'Nigerian Independence', query: 'Nigerian independence' },
      { label: 'Nigerian Civil War', query: 'Nigerian Civil War' },
    ],
    Timelines: [
      { label: 'Prehistoric Era', query: 'Prehistory' },
      { label: 'Ancient Era', query: 'Ancient history' },
      { label: 'Middle Ages', query: 'Middle Ages' },
      { label: 'Renaissance', query: 'Renaissance' },
      { label: 'Industrial Revolution', query: 'Industrial Revolution' },
      { label: 'Modern History', query: 'Contemporary history' },
    ],
    'Castles & Pyramids': [
      { label: 'Great Pyramid of Giza', query: 'Great Pyramid of Giza' },
      { label: 'Pyramid of Khafre', query: 'Pyramid of Khafre' },
      { label: 'Windsor Castle', query: 'Windsor Castle' },
      { label: 'Edinburgh Castle', query: 'Edinburgh Castle' },
      { label: 'Alhambra', query: 'Alhambra' },
      { label: 'Lalibela Churches', query: 'Rock-Hewn Churches, Lalibela' },
    ],
    Birds: [
      { label: 'Eagles', query: 'Eagle' },
      { label: 'Parrots', query: 'Parrot' },
      { label: 'Penguins', query: 'Penguin' },
      { label: 'Owls', query: 'Owl' },
      { label: 'Ostriches', query: 'Ostrich' },
      { label: 'Migration', query: 'Bird migration' },
    ],
    'Reptiles & Amphibians': [
      { label: 'Crocodiles', query: 'Crocodile' },
      { label: 'Snakes', query: 'Snake' },
      { label: 'Turtles', query: 'Turtle' },
      { label: 'Frogs', query: 'Frog' },
      { label: 'Salamanders', query: 'Salamander' },
      { label: 'Metamorphosis', query: 'Metamorphosis' },
    ],
    'Ocean Giants': [
      { label: 'Blue Whale', query: 'Blue whale' },
      { label: 'Orca', query: 'Orca' },
      { label: 'Whale Shark', query: 'Whale shark' },
      { label: 'Giant Squid', query: 'Giant squid' },
      { label: 'Manta Ray', query: 'Manta ray' },
      { label: 'Deep Ocean', query: 'Deep sea' },
    ],
    'Insects & Bugs': [
      { label: 'Butterflies', query: 'Butterfly' },
      { label: 'Bees', query: 'Bee' },
      { label: 'Ant Colonies', query: 'Ant' },
      { label: 'Beetles', query: 'Beetle' },
      { label: 'Mosquitoes', query: 'Mosquito' },
      { label: 'Life Cycle of Insects', query: 'Insect life cycle' },
    ],
    'Endangered Animals': [
      { label: 'Mountain Gorilla', query: 'Mountain gorilla' },
      { label: 'Black Rhino', query: 'Black rhinoceros' },
      { label: 'Sea Turtles', query: 'Sea turtle' },
      { label: 'Amur Leopard', query: 'Amur leopard' },
      { label: 'Pangolin', query: 'Pangolin' },
      { label: 'Wildlife Conservation', query: 'Wildlife conservation' },
    ],
    Plants: [
      { label: 'Parts of a Plant', query: 'Plant anatomy' },
      { label: 'Photosynthesis', query: 'Photosynthesis' },
      { label: 'Rainforest Plants', query: 'Rainforest flora' },
      { label: 'Desert Plants', query: 'Xerophyte' },
      { label: 'Flowering Plants', query: 'Flowering plant' },
      { label: 'Plant Adaptations', query: 'Plant adaptation' },
    ],
    'The Human Body': [
      { label: 'Brain', query: 'Human brain' },
      { label: 'Heart', query: 'Heart' },
      { label: 'Lungs', query: 'Lung' },
      { label: 'Digestive System', query: 'Human digestive system' },
      { label: 'Skeleton', query: 'Human skeleton' },
      { label: 'Immune System', query: 'Immune system' },
    ],
    'The Solar System': [
      { label: 'The Sun', query: 'Sun' },
      { label: 'Inner Planets', query: 'Inner planets' },
      { label: 'Gas Giants', query: 'Gas giant' },
      { label: 'Moons', query: 'Moon' },
      { label: 'Asteroids', query: 'Asteroid' },
      { label: 'Comets', query: 'Comet' },
    ],
    'Weather & Climate': [
      { label: 'Cloud Types', query: 'Cloud' },
      { label: 'Rain and Storms', query: 'Thunderstorm' },
      { label: 'Hurricanes', query: 'Tropical cyclone' },
      { label: 'Climate Zones', query: 'Climate' },
      { label: 'Seasons', query: 'Season' },
      { label: 'Climate Change', query: 'Climate change' },
    ],
    Electricity: [
      { label: 'Electric Circuits', query: 'Electrical circuit' },
      { label: 'Static Electricity', query: 'Static electricity' },
      { label: 'Batteries', query: 'Battery (electricity)' },
      { label: 'Power Stations', query: 'Power station' },
      { label: 'Renewable Energy', query: 'Renewable energy' },
      { label: 'Safety Rules', query: 'Electrical safety' },
    ],
    'States of Matter': [
      { label: 'Solids', query: 'Solid' },
      { label: 'Liquids', query: 'Liquid' },
      { label: 'Gases', query: 'Gas' },
      { label: 'Plasma', query: 'Plasma (physics)' },
      { label: 'Melting and Freezing', query: 'Melting' },
      { label: 'Evaporation and Condensation', query: 'Evaporation' },
    ],
    'Football (Soccer)': [
      { label: 'Rules of the Game', query: 'Laws of the Game (association football)' },
      { label: 'Player Positions', query: 'Association football positions' },
      { label: 'FIFA World Cup', query: 'FIFA World Cup' },
      { label: 'African Football', query: 'CAF Africa Cup of Nations' },
      { label: 'Famous Footballers', query: 'List of association football players' },
      { label: 'How to Train', query: 'Association football training' },
    ],
    Basketball: [
      { label: 'Rules and Scoring', query: 'Basketball rules' },
      { label: 'NBA', query: 'National Basketball Association' },
      { label: 'Women in Basketball', query: 'Women\'s National Basketball Association' },
      { label: 'Passing and Dribbling', query: 'Dribble' },
      { label: 'Slam Dunks', query: 'Slam dunk' },
      { label: 'Famous Players', query: 'List of National Basketball Association players' },
    ],
    Athletics: [
      { label: 'Sprinting', query: 'Sprint (running)' },
      { label: 'Long Jump', query: 'Long jump' },
      { label: 'High Jump', query: 'High jump' },
      { label: 'Relay Races', query: 'Relay race' },
      { label: 'Marathon', query: 'Marathon' },
      { label: 'Track and Field Events', query: 'Track and field' },
    ],
    Swimming: [
      { label: 'Freestyle', query: 'Freestyle swimming' },
      { label: 'Backstroke', query: 'Backstroke' },
      { label: 'Breaststroke', query: 'Breaststroke' },
      { label: 'Butterfly Stroke', query: 'Butterfly stroke' },
      { label: 'Swimming Safety', query: 'Water safety' },
      { label: 'Olympic Swimming', query: 'Swimming at the Summer Olympics' },
    ],
    'The Olympics': [
      { label: 'Ancient Olympics', query: 'Ancient Olympic Games' },
      { label: 'Modern Olympics', query: 'Olympic Games' },
      { label: 'Olympic Symbols', query: 'Olympic symbols' },
      { label: 'Summer Sports', query: 'Summer Olympic Games' },
      { label: 'Winter Sports', query: 'Winter Olympic Games' },
      { label: 'Paralympics', query: 'Paralympic Games' },
    ],
    'Martial Arts': [
      { label: 'Karate', query: 'Karate' },
      { label: 'Taekwondo', query: 'Taekwondo' },
      { label: 'Judo', query: 'Judo' },
      { label: 'Kung Fu', query: 'Chinese martial arts' },
      { label: 'Self-Discipline', query: 'Self-discipline' },
      { label: 'Belt Levels', query: 'Rank in martial arts' },
    ],
    'Drawing & Painting': [
      { label: 'Sketching Basics', query: 'Drawing' },
      { label: 'Watercolor', query: 'Watercolor painting' },
      { label: 'Acrylic Painting', query: 'Acrylic paint' },
      { label: 'Color Theory', query: 'Color theory' },
      { label: 'Portrait Art', query: 'Portrait painting' },
      { label: 'Landscape Art', query: 'Landscape painting' },
    ],
    Music: [
      { label: 'Rhythm and Beat', query: 'Rhythm' },
      { label: 'Melody', query: 'Melody' },
      { label: 'Instruments', query: 'Musical instrument' },
      { label: 'Choir and Singing', query: 'Choir' },
      { label: 'African Music', query: 'Music of Africa' },
      { label: 'Classical Music', query: 'Classical music' },
    ],
    Dance: [
      { label: 'Ballet', query: 'Ballet' },
      { label: 'Hip-Hop Dance', query: 'Hip-hop dance' },
      { label: 'Traditional African Dance', query: 'African dance' },
      { label: 'Contemporary Dance', query: 'Contemporary dance' },
      { label: 'Dance Costumes', query: 'Dance costume' },
      { label: 'Famous Dancers', query: 'List of dancers' },
    ],
    Sculpture: [
      { label: 'Clay Sculpture', query: 'Clay' },
      { label: 'Stone Carving', query: 'Stone carving' },
      { label: 'Bronze Sculpture', query: 'Bronze sculpture' },
      { label: 'Public Monuments', query: 'Monument' },
      { label: 'Relief Sculpture', query: 'Relief' },
      { label: 'Famous Sculptors', query: 'List of sculptors' },
    ],
    Photography: [
      { label: 'Camera Basics', query: 'Camera' },
      { label: 'Portrait Photography', query: 'Portrait photography' },
      { label: 'Nature Photography', query: 'Nature photography' },
      { label: 'Photo Composition', query: 'Composition (visual arts)' },
      { label: 'Lighting', query: 'Photographic lighting' },
      { label: 'Photo Editing', query: 'Image editing' },
    ],
    Folktales: [
      { label: 'Anansi Stories', query: 'Anansi' },
      { label: 'Tortoise Tales', query: 'Tortoise in folklore' },
      { label: 'Moral Lessons', query: 'Moral' },
      { label: 'Oral Tradition', query: 'Oral tradition' },
      { label: 'Trickster Characters', query: 'Trickster' },
      { label: 'World Folktales', query: 'Folklore' },
    ],
    'African Proverbs': [
      { label: 'Wisdom About Community', query: 'African philosophy' },
      { label: 'Respect and Character', query: 'Virtue ethics' },
      { label: 'Work and Patience', query: 'Patience' },
      { label: 'Learning Through Proverbs', query: 'Proverb' },
      { label: 'Yoruba Proverbs', query: 'Yoruba culture' },
      { label: 'Akan Proverbs', query: 'Akan people' },
    ],
    Poetry: [
      { label: 'Rhymes', query: 'Rhyme' },
      { label: 'Haiku', query: 'Haiku' },
      { label: 'Acrostic Poems', query: 'Acrostic' },
      { label: 'Spoken Word', query: 'Spoken word' },
      { label: 'Poetic Devices', query: 'Poetic device' },
      { label: 'Famous Poets', query: 'List of poets' },
    ],
    'Creative Writing': [
      { label: 'Story Starters', query: 'Creative writing' },
      { label: 'Character Building', query: 'Character (arts)' },
      { label: 'Setting and Atmosphere', query: 'Setting (narrative)' },
      { label: 'Plot Twists', query: 'Plot twist' },
      { label: 'Dialogue Tips', query: 'Dialogue' },
      { label: 'Editing Drafts', query: 'Revision (writing)' },
    ],
    'Myths & Legends': [
      { label: 'Greek Myths', query: 'Greek mythology' },
      { label: 'Norse Legends', query: 'Norse mythology' },
      { label: 'African Legends', query: 'African mythology' },
      { label: 'Heroes and Monsters', query: 'Hero' },
      { label: 'Creation Stories', query: 'Creation myth' },
      { label: 'Legend vs Myth', query: 'Legend' },
    ],
    'Great Books': [
      { label: 'Adventure Classics', query: 'Adventure novel' },
      { label: 'Children\'s Literature', query: 'Children\'s literature' },
      { label: 'Fantasy Stories', query: 'Fantasy literature' },
      { label: 'Mystery Books', query: 'Mystery fiction' },
      { label: 'African Authors', query: 'African literature' },
      { label: 'Book Reviews', query: 'Book review' },
    ],
  };

  const topicOptions = useMemo(() => {
    if (!selectedTopic) return [];
    const overrideOptions = topicOptionOverrides[selectedTopic];
    if (overrideOptions && overrideOptions.length > 0) {
      return overrideOptions;
    }

    const siblings = getCategoryTopics(selectedCategory)
      .filter((topic) => topic.title !== selectedTopic)
      .slice(0, 5)
      .map((topic) => ({
        label: topic.title,
        query: topic.title,
        meta: topic.description,
      }));

    return [
      { label: `About ${selectedTopic}`, query: selectedTopic, meta: 'Overview' },
      ...siblings,
    ];
  }, [selectedTopic, selectedCategory]);

  const handleTopicListClick = (topicTitle: string) => {
    if (typeof onCategoryClick === 'function') {
      const categoryTopicMap = CATEGORY_TOPIC_TO_SUBCATEGORY_ID[selectedCategory];
      const subcategoryId = categoryTopicMap?.[topicTitle] || inferSubcategoryId(selectedCategory, topicTitle);
      onCategoryClick(selectedCategory, subcategoryId);
      return;
    }

    setSelectedTopic(topicTitle);
  };

  const [dailyTopic, setDailyTopic] = useState<any>(null); // Use any to avoid strict type check on static topics structure for now or update type

  useEffect(() => {
    // Flatten the STATIC_TOPICS to a single array
    const allTopics: TopicPreview[] = [];
    Object.values(STATIC_TOPICS).forEach((list: any) => {
        if(Array.isArray(list)) allTopics.push(...list);
    });

    if (allTopics.length > 0) {
        const today = new Date();
        // Use date to seed a consistent random choice
        const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
        const index = seed % allTopics.length;
        setDailyTopic(allTopics[index]);
    }
  }, []);

  const activeSubcategories = SUBCATEGORIES_DATA[selectedCategory] || [];

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="tb-hero" aria-labelledby="hero-title">
        <div className="tb-hero-intro">
          <span className="tb-hero-kicker">The children&apos;s encyclopedia</span>
          <h1 id="hero-title" className="tb-hero-title">ThinkBox</h1>
          <p className="tb-hero-lede">Explore everything. Ask better questions. Find your next fascinating thing.</p>
        </div>

        <div className="tb-home-stage">
          <aside className="tb-stage-rail" aria-label="Explore subjects">
            {leftCategories.map((cat) => (
              <button
                key={cat}
                className={`tb-stage-category ${selectedCategory === cat ? 'tb-stage-category--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-label={`${cat} category`}
              >
                <span className="tb-stage-category-icon" role="img" aria-hidden="true">{CATEGORY_CONFIG[cat].icon}</span>
                <span>{categoryDisplayNames[cat]}</span>
              </button>
            ))}
          </aside>

          <div className="tb-stage-center">
            <div className="tb-stage-menu" aria-label={`${categoryDisplayNames[selectedCategory]} topics`}>
              <div className="tb-stage-menu-heading">
                <div>
                  <span className="tb-stage-menu-kicker">Explore subjects</span>
                  <h2>{categoryDisplayNames[selectedCategory]}</h2>
                </div>
                <span className="tb-stage-menu-icon" aria-hidden="true">{CATEGORY_CONFIG[selectedCategory].icon}</span>
              </div>
              <p className="tb-stage-menu-description">{CATEGORY_CONFIG[selectedCategory].description}</p>
              <div className="tb-stage-topic-list">
                {activeSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    className="tb-stage-topic"
                    onClick={() => onCategoryClick?.(selectedCategory, subcategory.id)}
                    aria-label={`Open ${subcategory.title}`}
                  >
                    <span>{subcategory.title}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="tb-stage-rail" aria-label="More subjects">
            {rightCategories.map((cat) => (
              <button
                key={cat}
                className={`tb-stage-category ${selectedCategory === cat ? 'tb-stage-category--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-label={`${cat} category`}
              >
                <span className="tb-stage-category-icon" role="img" aria-hidden="true">{CATEGORY_CONFIG[cat].icon}</span>
                <span>{categoryDisplayNames[cat]}</span>
              </button>
            ))}
          </aside>
        </div>
      </section>

      {/* ── Encarta-style Navigation ─────────────────── */}
      <section aria-label="Browse categories" className="tb-encarta-wrap">
        <div className="tb-encarta-layout">
          <aside className="tb-encarta-rail" aria-label="Left categories">
            {leftCategories.map((cat) => (
              <button
                key={cat}
                className={`tb-encarta-category-btn ${
                  selectedCategory === cat ? 'tb-encarta-category-btn--active' : ''
                } ${isCategoryMatch(cat) ? '' : 'tb-encarta-category-btn--dimmed'}`}
                onClick={() => setSelectedCategory(cat)}
                aria-label={`${cat} category`}
              >
                <span className="tb-encarta-category-icon" role="img" aria-hidden="true">
                  {CATEGORY_CONFIG[cat].icon}
                </span>
                <span>{categoryDisplayNames[cat]}</span>
              </button>
            ))}
          </aside>

          <div className="tb-encarta-panel" aria-label={`${selectedCategory} submenu`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h2 className="tb-encarta-panel-title">{categoryDisplayNames[selectedCategory]}</h2>
              {onCategoryClick && (
                <button
                  onClick={() => onCategoryClick(selectedCategory)}
                  title="Browse subcategories"
                  style={{
                    background: '#58CC02',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#46A302';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#58CC02';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  📂 Categories
                </button>
              )}
            </div>
            <p className="tb-encarta-panel-subtitle">{CATEGORY_CONFIG[selectedCategory].description}</p>

            {selectedTopic && (
              <div className="tb-encarta-submenu" aria-label={`${selectedTopic} options`}>
                <p className="tb-encarta-submenu-heading">{selectedTopic}</p>
                <div className="tb-encarta-option-grid">
                  {topicOptions.map((option) => (
                    <button
                      key={`${option.label}-${option.query}`}
                      className="tb-encarta-option"
                      onClick={() => onTopicClick(option.query)}
                      aria-label={`Open ${option.query}`}
                    >
                      <span className="tb-encarta-option-title">{option.label}</span>
                      <span className="tb-encarta-option-meta">{option.meta || selectedTopic}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="tb-encarta-topic-list">
              {filteredTopics.length === 0 ? (
                <p className="tb-encarta-empty">No topics match your search in {selectedCategory}.</p>
              ) : (
                filteredTopics.map((topic) => (
                  <button
                    key={topic.title}
                    className={`tb-encarta-topic ${
                      selectedTopic === topic.title ? 'tb-encarta-topic--active' : ''
                    }`}
                    onClick={() => handleTopicListClick(topic.title)}
                    aria-label={`Show options for ${topic.title}`}
                  >
                    <span className="tb-encarta-topic-icon" role="img" aria-hidden="true">
                      {CATEGORY_CONFIG[selectedCategory].icon}
                    </span>
                    <span className="tb-encarta-topic-text">{topic.title}</span>
                    <ArrowRight size={16} className="tb-encarta-topic-arrow" />
                  </button>
                ))
              )}
            </div>
          </div>

          <aside className="tb-encarta-rail" aria-label="Right categories">
            {rightCategories.map((cat) => (
              <button
                key={cat}
                className={`tb-encarta-category-btn ${
                  selectedCategory === cat ? 'tb-encarta-category-btn--active' : ''
                } ${isCategoryMatch(cat) ? '' : 'tb-encarta-category-btn--dimmed'}`}
                onClick={() => setSelectedCategory(cat)}
                aria-label={`${cat} category`}
              >
                <span className="tb-encarta-category-icon" role="img" aria-hidden="true">
                  {CATEGORY_CONFIG[cat].icon}
                </span>
                <span>{categoryDisplayNames[cat]}</span>
              </button>
            ))}
          </aside>
        </div>
      </section>

      {exploredCategories.size > 0 && (
        <p className="tb-encarta-footer-note">
          Explored categories today: {Array.from(exploredCategories).join(', ')}
        </p>
      )}
    </div>
  );
};
