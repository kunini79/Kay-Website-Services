import { ExternalServiceError } from '@/lib/logger';

const DEFAULT_OLLAMA_URL = 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'llama3.2:3b';

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function getOllamaUrl(): string {
  const configured = process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_URL;
  const url = new URL(configured);

  // The first deployment is intentionally local-only. Do not turn this into
  // an arbitrary server-side fetch through an environment variable.
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '::1'].includes(url.hostname)) {
    throw new Error('OLLAMA_BASE_URL must point to a local HTTP Ollama server.');
  }

  return url.toString().replace(/\/$/, '');
}

export async function askOllama(messages: OllamaMessage[]): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(`${getOllamaUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || DEFAULT_MODEL,
        messages,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2,
          num_predict: 500,
        },
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new ExternalServiceError('Ollama', `returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as { message?: { content?: unknown } };
    const answer = typeof data.message?.content === 'string' ? data.message.content.trim() : '';
    if (!answer) throw new ExternalServiceError('Ollama', 'returned an empty response');
    return answer;
  } catch (error) {
    if (error instanceof ExternalServiceError) throw error;
    throw new ExternalServiceError('Ollama', error instanceof Error ? error.message : 'request failed');
  } finally {
    clearTimeout(timeout);
  }
}