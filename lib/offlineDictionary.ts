export interface DictionaryEntry {
  word: string;
  meaning: string;
  example: string;
}

const DICTIONARY: Record<string, Omit<DictionaryEntry, 'word'>> = {
  photosynthesis: { meaning: 'How plants use sunlight, water, and air to make food.', example: 'A green leaf uses photosynthesis to make food for the plant.' },
  ecosystem: { meaning: 'A community of living things and the environment where they live.', example: 'A pond ecosystem includes fish, plants, insects, and water.' },
  civilization: { meaning: 'A large, organized society with cities, rules, and shared culture.', example: 'Ancient Egypt was an important civilization.' },
  democracy: { meaning: 'A system of government where people help choose their leaders.', example: 'In a democracy, citizens can vote.' },
  gravity: { meaning: 'The force that pulls objects toward one another, including toward Earth.', example: 'Gravity makes a ball fall when you drop it.' },
  atmosphere: { meaning: 'The layer of gases surrounding a planet.', example: 'Earth’s atmosphere gives us air to breathe.' },
  herbivore: { meaning: 'An animal that mainly eats plants.', example: 'A cow is a herbivore.' },
  carnivore: { meaning: 'An animal that mainly eats other animals.', example: 'A lion is a carnivore.' },
  endangered: { meaning: 'At risk of disappearing forever.', example: 'Some endangered animals are protected in wildlife reserves.' },
  constellation: { meaning: 'A group of stars that people imagine as a pattern or picture.', example: 'Orion is a well-known constellation.' },
  mammal: { meaning: 'A warm-blooded animal whose young drink milk from their mother.', example: 'A dolphin is a mammal even though it lives in water.' },
  amphibian: { meaning: 'An animal that can live part of its life in water and part on land.', example: 'A frog is an amphibian.' },
  hieroglyphics: { meaning: 'A writing system that uses pictures and symbols, especially ancient Egyptian writing.', example: 'The Egyptians carved hieroglyphics on temple walls.' },
  pharaoh: { meaning: 'A ruler of ancient Egypt.', example: 'A pharaoh ruled Egypt thousands of years ago.' },
  innovation: { meaning: 'A new idea, method, or invention that solves a problem.', example: 'The new water filter was an important innovation.' },
  technology: { meaning: 'Tools, machines, or methods people create to solve problems.', example: 'A computer is a type of technology.' },
  satellite: { meaning: 'An object that travels around a planet or another object in space.', example: 'The Moon is Earth’s natural satellite.' },
  telescope: { meaning: 'A tool that helps us see distant objects, especially in space.', example: 'A telescope can help you observe the Moon.' },
  volcano: { meaning: 'An opening in Earth’s crust that can release hot rock, ash, and gases.', example: 'Lava can flow from a volcano during an eruption.' },
  migration: { meaning: 'The movement of people or animals from one place to another.', example: 'Some birds migrate to warmer places each year.' },
  dividend: { meaning: 'The number that is being divided.', example: 'In 12 divided by 3, 12 is the dividend.' },
  divisor: { meaning: 'The number that divides another number.', example: 'In 12 divided by 3, 3 is the divisor.' },
  quotient: { meaning: 'The answer produced by a division problem.', example: 'The quotient of 12 divided by 3 is 4.' },
  remainder: { meaning: 'The amount left over after a division problem.', example: 'When 13 is divided by 5, the remainder is 3.' },
  diaspora: { meaning: 'People from a place and their descendants living in different parts of the world.', example: 'The African diaspora includes communities around the world.' },
  tonal: { meaning: 'Describing a language where pitch can change a word’s meaning.', example: 'Yoruba is a tonal language.' },
  culture: { meaning: 'The ideas, customs, arts, language, and way of life shared by a group.', example: 'Food and music are parts of culture.' },
};

const normalize = (value: string) => value.toLowerCase().trim().replace(/^[^a-z]+|[^a-z]+$/g, '');

export function lookupDictionary(word: string): DictionaryEntry | null {
  const key = normalize(word);
  const entry = DICTIONARY[key];
  return entry ? { word: key, ...entry } : null;
}

export function findDictionaryEntries(text: string, limit = 3): DictionaryEntry[] {
  const words = text.match(/[a-zA-Z]+/g) || [];
  const found: DictionaryEntry[] = [];
  const seen = new Set<string>();
  for (const word of words) {
    const entry = lookupDictionary(word);
    if (!entry || seen.has(entry.word)) continue;
    seen.add(entry.word);
    found.push(entry);
    if (found.length >= limit) break;
  }
  return found;
}

export function dictionaryEntriesForQuestion(question: string): DictionaryEntry[] {
  const directMatch = question.match(/(?:what does|define|meaning of|what is)\s+(?:the word\s+)?([a-zA-Z]+)/i);
  if (directMatch) {
    const entry = lookupDictionary(directMatch[1]);
    if (entry) return [entry];
  }
  return findDictionaryEntries(question, 3);
}
