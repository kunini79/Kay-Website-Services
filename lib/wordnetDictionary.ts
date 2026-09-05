import fs from 'node:fs/promises';
import path from 'node:path';

export interface WordNetEntry {
  word: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  meaning: string;
  example: string;
}

type WordNetPart = WordNetEntry['partOfSpeech'];

const files: Array<{ partOfSpeech: WordNetPart; indexFile: string; dataFile: string }> = [
  { partOfSpeech: 'noun', indexFile: 'index.noun', dataFile: 'data.noun' },
  { partOfSpeech: 'verb', indexFile: 'index.verb', dataFile: 'data.verb' },
  { partOfSpeech: 'adjective', indexFile: 'index.adj', dataFile: 'data.adj' },
  { partOfSpeech: 'adverb', indexFile: 'index.adv', dataFile: 'data.adv' },
];

let indexPromise: Promise<Map<string, WordNetEntry[]>> | null = null;

function dictionaryPath(fileName: string): string {
  return path.join(process.cwd(), 'node_modules', 'wordnet-db', 'dict', fileName);
}

function cleanLemma(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase().trim();
}

function parseGloss(gloss: string): { meaning: string; example: string } {
  const exampleMatch = gloss.match(/^(.*?);\s*"([^"]+)"\s*$/);
  return {
    meaning: (exampleMatch?.[1] || gloss).trim(),
    example: (exampleMatch?.[2] || '').trim(),
  };
}

async function loadIndex(): Promise<Map<string, WordNetEntry[]>> {
  const index = new Map<string, WordNetEntry[]>();

  for (const file of files) {
    const [indexText, dataText] = await Promise.all([
      fs.readFile(dictionaryPath(file.indexFile), 'utf8'),
      fs.readFile(dictionaryPath(file.dataFile), 'utf8'),
    ]);
    const dataByOffset = new Map<string, string>();
    for (const line of dataText.split(/\r?\n/)) {
      if (!line || line.startsWith('  ')) continue;
      const offset = line.slice(0, 8).trim();
      if (/^\d+$/.test(offset)) dataByOffset.set(offset, line);
    }

    for (const line of indexText.split(/\r?\n/)) {
      if (!line || line.startsWith(' ')) continue;
      const fields = line.split(/\s+/);
      if (fields.length < 7) continue;
      const pointerCount = Number(fields[3]);
      const synsetCount = Number(fields[2]);
      if (!Number.isInteger(pointerCount) || !Number.isInteger(synsetCount)) continue;
      const offsetStart = 6 + pointerCount;
      const lemma = cleanLemma(fields[0]);
      for (const offset of fields.slice(offsetStart, offsetStart + synsetCount)) {
        const dataLine = dataByOffset.get(offset);
        if (!dataLine) continue;
        const gloss = dataLine.split('|')[1]?.trim() || '';
        const parsed = parseGloss(gloss);
        const entry: WordNetEntry = {
          word: lemma,
          partOfSpeech: file.partOfSpeech,
          meaning: parsed.meaning,
          example: parsed.example,
        };
        const key = lemma;
        const entries = index.get(key) || [];
        if (!entries.some((candidate) => candidate.meaning === entry.meaning && candidate.partOfSpeech === entry.partOfSpeech)) {
          entries.push(entry);
        }
        index.set(key, entries);
      }
    }
  }

  return index;
}

async function getIndex() {
  if (!indexPromise) indexPromise = loadIndex();
  return indexPromise;
}

export async function lookupWordNet(word: string, limit = 5): Promise<WordNetEntry[]> {
  const key = cleanLemma(word);
  if (!key || key.length > 80 || !/^[a-z][a-z '-]*$/i.test(key)) return [];
  const index = await getIndex();
  return (index.get(key) || []).slice(0, limit);
}
