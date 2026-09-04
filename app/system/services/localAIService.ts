/**
 * localAIService.ts
 *
 * Runs AI article generation entirely in the browser — no internet required.
 *
 * Strategy (in priority order):
 *   1. Chrome Built-in AI (`window.ai` / Prompt API) — Gemma 3 Nano, zero bundle size,
 *      already on the device via Chrome 127+. Works offline immediately.
 *   2. Transformers.js — Phi-3.5-mini-instruct (ONNX Q4, ~600 MB).
 *      Downloaded once to the browser's cache (IndexedDB/OPFS), then fully offline.
 *
 * The service is intentionally lazy — neither engine is loaded until the first call.
 * Model downloads happen on-demand, reporting progress via the onProgress callback.
 */

import type { Article } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LocalAIMode = 'window.ai' | 'transformers.js' | 'unavailable';

export type LocalAIStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'ready'
  | 'generating'
  | 'error'
  | 'unavailable';

export interface LocalAIProgress {
  status: LocalAIStatus;
  mode: LocalAIMode | null;
  /** 0-100 during download, null otherwise */
  downloadProgress: number | null;
  /** Human-readable status message */
  message: string;
}

type ProgressCallback = (progress: LocalAIProgress) => void;

// ─── Model config ─────────────────────────────────────────────────────────────

/** Hugging Face model ID for Transformers.js fallback.
 *  Phi-3.5 mini instruct Q4: good quality, ~600 MB, runs in WebGPU or WASM */
const HF_MODEL_ID = 'Xenova/Phi-3.5-mini-instruct';

// ─── State ────────────────────────────────────────────────────────────────────

let _mode: LocalAIMode | null = null;
let _ready = false;
let _transformersPipeline: any = null; // cached pipeline instance

// ─── window.ai helpers ───────────────────────────────────────────────────────

/** True if the Chrome Built-in Prompt API is available and a model is ready. */
async function isWindowAIAvailable(): Promise<boolean> {
  try {
    const ai = (window as any).ai;
    if (!ai?.languageModel) return false;
    const caps = await ai.languageModel.capabilities();
    // 'readily' means model is already downloaded; 'after-download' means it needs to be fetched
    return caps?.available === 'readily' || caps?.available === 'after-download';
  } catch {
    return false;
  }
}

async function generateWithWindowAI(prompt: string): Promise<string> {
  const session = await (window as any).ai.languageModel.create({
    systemPrompt:
      'You are generating educational encyclopedia JSON for children aged 8-12. Return valid JSON only with no markdown fences.',
  });
  const result = await session.prompt(prompt);
  session.destroy();
  return result;
}

// ─── Transformers.js helpers ─────────────────────────────────────────────────

async function loadTransformersPipeline(
  onProgress: ProgressCallback
): Promise<any> {
  if (_transformersPipeline) return _transformersPipeline;

  // Dynamic import — keeps the bundle lean until the user triggers local AI
  const { pipeline, env } = await import('@huggingface/transformers');

  // Allow downloading models from Hugging Face Hub into browser cache
  env.allowLocalModels = false;
  env.useBrowserCache = true;

  onProgress({
    status: 'downloading',
    mode: 'transformers.js',
    downloadProgress: 0,
    message: 'Downloading Phi-3.5 Mini (first time only, ~600 MB)…',
  });

  const pipe = await pipeline('text-generation', HF_MODEL_ID, {
    dtype: 'q4',
    device: 'webgpu', // falls back to WASM automatically if WebGPU unavailable
    progress_callback: (info: any) => {
      if (info.status === 'progress' && typeof info.progress === 'number') {
        onProgress({
          status: 'downloading',
          mode: 'transformers.js',
          downloadProgress: Math.round(info.progress),
          message: `Downloading AI model: ${Math.round(info.progress)}%`,
        });
      }
    },
  });

  _transformersPipeline = pipe;
  return pipe;
}

async function generateWithTransformersJS(
  prompt: string,
  onProgress: ProgressCallback
): Promise<string> {
  const pipe = await loadTransformersPipeline(onProgress);

  onProgress({
    status: 'generating',
    mode: 'transformers.js',
    downloadProgress: null,
    message: 'Local AI is thinking…',
  });

  const messages = [
    {
      role: 'system',
      content:
        'You are generating educational encyclopedia JSON for children aged 8-12. Return valid JSON only with no markdown fences.',
    },
    { role: 'user', content: prompt },
  ];

  const result = await pipe(messages, {
    max_new_tokens: 1200,
    temperature: 0.3,
    do_sample: true,
    return_full_text: false,
  });

  const raw: string =
    result?.[0]?.generated_text ??
    (Array.isArray(result?.[0]?.generated_text)
      ? result[0].generated_text.at(-1)?.content
      : '') ??
    '';

  return raw.trim();
}

// ─── Article JSON extraction ─────────────────────────────────────────────────

/**
 * Local models sometimes wrap JSON in markdown fences or add preamble text.
 * This extracts the first valid JSON object from raw model output.
 */
function extractJSON(raw: string): string {
  // Strip markdown code fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();

  // Find the first { … } block
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end > start) return raw.slice(start, end + 1);

  return raw;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Detect which local AI engine is available.
 * Call this on page load to warm-up detection without loading models.
 */
export async function detectLocalAIMode(): Promise<LocalAIMode> {
  if (_mode) return _mode;

  if (typeof window === 'undefined') {
    _mode = 'unavailable';
    return _mode;
  }

  if (await isWindowAIAvailable()) {
    _mode = 'window.ai';
    return _mode;
  }

  // Check if Transformers.js can run (WebGPU or WASM must be available)
  const hasWASM = typeof WebAssembly !== 'undefined';
  if (hasWASM) {
    _mode = 'transformers.js';
    return _mode;
  }

  _mode = 'unavailable';
  return _mode;
}

/**
 * Returns true if a local AI engine is available (even if model not yet downloaded).
 */
export async function isLocalAIAvailable(): Promise<boolean> {
  const mode = await detectLocalAIMode();
  return mode !== 'unavailable';
}

/**
 * Pre-warms / downloads the local AI model.
 * Call this when the user explicitly clicks "Download Offline AI".
 * Reports progress via onProgress callback.
 */
export async function prepareLocalAI(
  onProgress: ProgressCallback
): Promise<void> {
  const mode = await detectLocalAIMode();

  if (mode === 'unavailable') {
    onProgress({
      status: 'unavailable',
      mode: null,
      downloadProgress: null,
      message: 'Local AI is not supported in this browser.',
    });
    return;
  }

  if (mode === 'window.ai') {
    // window.ai is already ready — nothing to download
    _ready = true;
    onProgress({
      status: 'ready',
      mode: 'window.ai',
      downloadProgress: null,
      message: 'Chrome AI is ready (built-in, no download needed).',
    });
    return;
  }

  // Transformers.js — trigger model download
  onProgress({
    status: 'downloading',
    mode: 'transformers.js',
    downloadProgress: 0,
    message: 'Starting model download…',
  });

  await loadTransformersPipeline(onProgress);
  _ready = true;

  onProgress({
    status: 'ready',
    mode: 'transformers.js',
    downloadProgress: null,
    message: 'Local AI ready — ThinkBox can now work offline!',
  });
}

/**
 * True if the local AI model has been downloaded and is ready to generate.
 */
export function isLocalAIReady(): boolean {
  return _ready;
}

/**
 * Generate a structured ThinkBox article using the local AI engine.
 * Falls back gracefully if neither engine can generate content.
 *
 * @param topic          The topic requested by the user
 * @param sourceContent  Wikipedia/NASA text to use as grounding context
 * @param onProgress     Optional progress callback
 */
export async function generateLocalArticle(
  topic: string,
  sourceContent: string,
  onProgress?: ProgressCallback
): Promise<Article> {
  const noop: ProgressCallback = () => {};
  const progress = onProgress ?? noop;

  const mode = await detectLocalAIMode();

  if (mode === 'unavailable') {
    throw new Error('Local AI is not supported in this browser.');
  }

  // ── Build the same prompt used by Gemini/OpenRouter ──────────────────────
  const prompt = `
Take this source content about "${topic}" and structure it for an 8-12 year old educational app (ThinkBox).

Source Content:
${sourceContent.slice(0, 2000)}

Requirements:
- Tone: Enthusiastic, clear, encouraging (Encarta style)
- Structure: 3-4 sections with short paragraphs
- For animals: Use headers like "Habitat & Home", "What's on the Menu?", "Family Life & Babies", "Super Senses & Body"
- Include one "Did You Know?" fun fact
- Suggest 3 related topics for further learning
- Generate a 3-question multiple-choice quiz (4 options each, correctAnswer index 0-3, brief explanation)
- Category: Choose from [Animals, Science, Sports and Recreation, Arts, Reading and Writing, People, Places, History, Social Studies, Games and Fun]

Return ONLY pure JSON (no markdown fences) with these exact keys:
{
  "title": string,
  "category": string,
  "intro": string,
  "funFact": string,
  "sections": [{ "subtitle": string, "content": string }],
  "relatedTopics": [string],
  "quiz": [{ "question": string, "options": [string], "correctAnswer": number, "explanation": string }]
}`;

  let rawText = '';

  progress({
    status: 'generating',
    mode,
    downloadProgress: null,
    message: 'Local AI is generating your article…',
  });

  if (mode === 'window.ai') {
    rawText = await generateWithWindowAI(prompt);
  } else {
    rawText = await generateWithTransformersJS(prompt, progress);
  }

  // ── Parse JSON ────────────────────────────────────────────────────────────
  let parsed: any;
  try {
    parsed = JSON.parse(extractJSON(rawText));
  } catch {
    throw new Error('Local AI returned invalid JSON. Please try again.');
  }

  // ── Validate & add defaults ───────────────────────────────────────────────
  const article: Article = {
    title: parsed.title || topic,
    category: parsed.category || 'General',
    intro: parsed.intro || `Learn about ${topic}.`,
    funFact: parsed.funFact || `${topic} is fascinating!`,
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    relatedTopics: Array.isArray(parsed.relatedTopics) ? parsed.relatedTopics : [],
    quiz: Array.isArray(parsed.quiz) ? parsed.quiz : [],
    imageSeed: topic,
    source: {
      type: 'offline',
      title: topic,
    },
    reviewStatus: 'ai-draft',
  };

  progress({
    status: 'ready',
    mode,
    downloadProgress: null,
    message: 'Article generated locally!',
  });

  return article;
}
