import React from 'react';
import { Category, TopicPreview } from './types';
import { 
  Beaker, 
  PawPrint, 
  History, 
  Trophy, 
  Palette,
  BookOpen,
  Users,
  Map,
  Landmark,
  Gamepad2
} from 'lucide-react';

export const CATEGORY_CONFIG: Record<Category, { color: string; icon: React.ReactNode; description: string }> = {
  [Category.ANIMALS]: {
    color: '#00892D',
    icon: <PawPrint className="w-6 h-6 text-white" />,
    description: "Lions, tigers, and bears!"
  },
  [Category.SCIENCE]: {
    color: '#0078C2',
    icon: <Beaker className="w-6 h-6 text-white" />,
    description: "Chemistry, Physics, and how stuff works."
  },
  [Category.SPORTS]: {
    color: '#C25400',
    icon: <Trophy className="w-6 h-6 text-white" />,
    description: "Games, athletes, and staying active."
  },
  [Category.ARTS]: {
    color: '#e91e8c',
    icon: <Palette className="w-6 h-6 text-white" />,
    description: "Painting, music, and creativity."
  },
  [Category.READING]: {
    color: '#592E87',
    icon: <BookOpen className="w-6 h-6 text-white" />,
    description: "Stories, poems, and authors."
  },
  [Category.PEOPLE]: {
    color: '#ffd72d',
    icon: <Users className="w-6 h-6 text-gray-800" />,
    description: "Famous biographies and leaders."
  },
  [Category.PLACES]: {
    color: '#14b8a6',
    icon: <Map className="w-6 h-6 text-white" />,
    description: "Countries, cities, and geography."
  },
  [Category.HISTORY]: {
    color: '#35016D',
    icon: <History className="w-6 h-6 text-white" />,
    description: "The past and ancient times."
  },
  [Category.SOCIAL_STUDIES]: {
    color: '#dc2626',
    icon: <Landmark className="w-6 h-6 text-white" />,
    description: "Communities and cultures."
  },
  [Category.GAMES]: {
    color: '#003C8C',
    icon: <Gamepad2 className="w-6 h-6 text-white" />,
    description: "Puzzles, coding, and fun!"
  }
};

export const INITIAL_SUGGESTIONS = [
  "Blue Whales",
  "The Pyramids",
  "Mars",
  "Electricity",
  "Dinosaurs"
];

// Curated Topics to enforce educational structure
export const STATIC_TOPICS: Partial<Record<Category, TopicPreview[]>> = {
  [Category.ANIMALS]: [
    { title: "Mammals", category: Category.ANIMALS, description: "Furry animals like lions, elephants, and us!" },
    { title: "The Big Five", category: Category.ANIMALS, description: "Africa's most famous safari superstars." },
    { title: "Birds", category: Category.ANIMALS, description: "Feathered friends that (mostly) fly." },
    { title: "Reptiles & Amphibians", category: Category.ANIMALS, description: "Scaly lizards, snakes, and hopping frogs." },
    { title: "Ocean Giants", category: Category.ANIMALS, description: "Whales, sharks, and life under the sea." },
    { title: "Rainforest Critters", category: Category.ANIMALS, description: "Colorful creatures from the deep jungle." },
    { title: "Baby Animals", category: Category.ANIMALS, description: "How animals grow up and learn." },
    { title: "Insects & Bugs", category: Category.ANIMALS, description: "Tiny creatures with six (or more) legs." },
    { title: "Super Fast Animals", category: Category.ANIMALS, description: "Cheetahs, falcons, and speed demons." },
    { title: "Endangered Animals", category: Category.ANIMALS, description: "Rare animals we need to protect." },
    { title: "Animal Homes", category: Category.ANIMALS, description: "Nests, dens, burrows, and caves." },
    { title: "Night Animals", category: Category.ANIMALS, description: "Creatures that wake up when you sleep." },
  ],
  [Category.SCIENCE]: [
    { title: "Plants", category: Category.SCIENCE, description: "Trees, flowers, and how they grow." },
    { title: "The Human Body", category: Category.SCIENCE, description: "How your amazing body works." },
    { title: "The Solar System", category: Category.SCIENCE, description: "Planets dancing around the Sun." },
    { title: "Weather & Climate", category: Category.SCIENCE, description: "Rain, sun, storms, and seasons." },
    { title: "Rocks & Minerals", category: Category.SCIENCE, description: "Stones, crystals, and the Earth's crust." },
    { title: "Light & Sound", category: Category.SCIENCE, description: "How we see and hear the world." },
    { title: "Electricity", category: Category.SCIENCE, description: "Powering lights, toys, and cities." },
    { title: "States of Matter", category: Category.SCIENCE, description: "Solids, Liquids, and Gases." },
    { title: "Simple Experiments", category: Category.SCIENCE, description: "Fun science you can do at home." },
    { title: "Ecosystems", category: Category.SCIENCE, description: "How nature works together." },
    { title: "Recycling", category: Category.SCIENCE, description: "Keeping our Earth clean and green." },
    { title: "Microorganisms", category: Category.SCIENCE, description: "Tiny life you can't see with your eyes!" }
  ],
  [Category.SPORTS]: [
    { title: "Football (Soccer)", category: Category.SPORTS, description: "The world's most popular game." },
    { title: "Basketball", category: Category.SPORTS, description: "Dribble, shoot, and score!" },
    { title: "Athletics", category: Category.SPORTS, description: "Running, jumping, and throwing." },
    { title: "African Games", category: Category.SPORTS, description: "Traditional fun from across the continent." },
    { title: "Swimming", category: Category.SPORTS, description: "Splashing and racing in the water." },
    { title: "Fitness & Exercise", category: Category.SPORTS, description: "Keeping your body strong and happy." },
    { title: "Famous Athletes", category: Category.SPORTS, description: "Sports heroes who made history." },
    { title: "The Olympics", category: Category.SPORTS, description: "The biggest sports party in the world." },
    { title: "Outdoor Adventure", category: Category.SPORTS, description: "Hiking, camping, and exploring." },
    { title: "Martial Arts", category: Category.SPORTS, description: "Discipline, strength, and focus." }
  ],
  [Category.ARTS]: [
    { title: "Drawing & Painting", category: Category.ARTS, description: "Creating art with colors and lines." },
    { title: "Music", category: Category.ARTS, description: "Rhythms, melodies, and instruments." },
    { title: "Dance", category: Category.ARTS, description: "Moving your body to the beat." },
    { title: "African Masks", category: Category.ARTS, description: "Beautiful symbols of culture and history." },
    { title: "Sculpture", category: Category.ARTS, description: "Making 3D shapes from clay and stone." },
    { title: "Storytelling", category: Category.ARTS, description: "The ancient art of telling great tales." },
    { title: "Photography", category: Category.ARTS, description: "Capturing moments with a camera." },
    { title: "Fashion Design", category: Category.ARTS, description: "Creating clothes and style." },
    { title: "Famous Artists", category: Category.ARTS, description: "People who changed how we see the world." }
  ],
  [Category.READING]: [
    { title: "Folktales", category: Category.READING, description: "Old stories passed down for generations." },
    { title: "African Proverbs", category: Category.READING, description: "Wise words from the elders." },
    { title: "Poetry", category: Category.READING, description: "Playing with words, rhymes, and feelings." },
    { title: "Creative Writing", category: Category.READING, description: "How to write your own amazing stories." },
    { title: "Myths & Legends", category: Category.READING, description: "Tales of heroes, gods, and magic." },
    { title: "Learning to Read", category: Category.READING, description: "Phonics, letters, and first words." },
    { title: "Vocabulary Fun", category: Category.READING, description: "Cool words to impress your friends." },
    { title: "Great Books", category: Category.READING, description: "Stories you shouldn't miss." }
  ],
  [Category.PEOPLE]: [
    { title: "African Heroes", category: Category.PEOPLE, description: "Legends and leaders from the continent." },
    { title: "Inventors", category: Category.PEOPLE, description: "Creators who built new things." },
    { title: "World Leaders", category: Category.PEOPLE, description: "Presidents, queens, and peacemakers." },
    { title: "Everyday Heroes", category: Category.PEOPLE, description: "Doctors, teachers, farmers, and you." },
    { title: "Famous Scientists", category: Category.PEOPLE, description: "People who discovered how the world works." },
    { title: "Artists & Musicians", category: Category.PEOPLE, description: "Creators of beauty and sound." },
    { title: "Careers", category: Category.PEOPLE, description: "Cool jobs you might do one day." },
    { title: "Family & Traditions", category: Category.PEOPLE, description: "Celebrations and life at home." }
  ],
  [Category.PLACES]: [
    { title: "Continents", category: Category.PLACES, description: "The seven big lands of our world." },
    { title: "Africa", category: Category.PLACES, description: "Exploring the beautiful continent." },
    { title: "Nigeria", category: Category.PLACES, description: "States, culture, and landmarks." },
    { title: "Natural Wonders", category: Category.PLACES, description: "Waterfalls, mountains, and canyons." },
    { title: "Oceans", category: Category.PLACES, description: "The deep blue waters surrounding us." },
    { title: "Famous Cities", category: Category.PLACES, description: "Bustling places full of people and lights." },
    { title: "Maps", category: Category.PLACES, description: "How to find your way around." },
    { title: "Deserts & Forests", category: Category.PLACES, description: "Extreme places where life finds a way." }
  ],
  [Category.HISTORY]: [
    { title: "Ancient Civilizations", category: Category.HISTORY, description: "Egypt, Rome, Greece, and more." },
    { title: "African Kingdoms", category: Category.HISTORY, description: "Great empires of the past." },
    { title: "Early Humans", category: Category.HISTORY, description: "Our oldest ancestors and how they lived." },
    { title: "Explorers", category: Category.HISTORY, description: "Travelers who found new lands." },
    { title: "Inventions", category: Category.HISTORY, description: "Discoveries that changed history." },
    { title: "Nigerian History", category: Category.HISTORY, description: "From the past to independence." },
    { title: "Timelines", category: Category.HISTORY, description: "When did important things happen?" },
    { title: "Castles & Pyramids", category: Category.HISTORY, description: "Buildings that have stood for ages." }
  ],
  [Category.SOCIAL_STUDIES]: [
    { title: "Citizenship", category: Category.SOCIAL_STUDIES, description: "Being a good member of your community." },
    { title: "Government", category: Category.SOCIAL_STUDIES, description: "How rules and laws are made." },
    { title: "Culture", category: Category.SOCIAL_STUDIES, description: "Food, clothes, and festivals." },
    { title: "Money & Trade", category: Category.SOCIAL_STUDIES, description: "Buying, selling, and saving." },
    { title: "Global Peace", category: Category.SOCIAL_STUDIES, description: "Working together for a better world." },
    { title: "Rights & Duties", category: Category.SOCIAL_STUDIES, description: "What you can do and what you should do." },
    { title: "Religions", category: Category.SOCIAL_STUDIES, description: "What people believe around the world." }
  ],
  [Category.GAMES]: [
    { title: "Brain Teasers", category: Category.GAMES, description: "Riddles to test your mind." },
    { title: "Logic Puzzles", category: Category.GAMES, description: "Games that make you think hard." },
    { title: "Weird Science", category: Category.GAMES, description: "Strange but true facts!" },
    { title: "Jokes", category: Category.GAMES, description: "Laugh out loud with these." },
    { title: "Optical Illusions", category: Category.GAMES, description: "Can you trust your eyes?" },
    { title: "Creative Challenges", category: Category.GAMES, description: "Fun things to draw and make." },
    { title: "Math Magic", category: Category.GAMES, description: "Tricks with numbers." }
  ]
};