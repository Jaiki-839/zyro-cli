import { AIMessage, AIProviderName, JaikiConfig } from '../types';
import { getProvider } from '../providers/ai';

/**
 * High-level AI operations used by the ai/chat/ask/explain/fix/generate
 * commands. Keeps prompt-engineering concerns out of the command layer.
 */

export async function askAI(config: JaikiConfig, prompt: string): Promise<string> {
  const provider = getProvider(config.provider);
  ensureConfigured(provider.name, config.provider);
  const messages: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are Jaiki CLI, a concise and helpful AI assistant embedded in a developer terminal.',
    },
    { role: 'user', content: prompt },
  ];
  return provider.complete(messages);
}

export async function explainCode(config: JaikiConfig, code: string): Promise<string> {
  const provider = getProvider(config.provider);
  ensureConfigured(provider.name, config.provider);
  const messages: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are a senior software engineer. Explain the given code clearly and concisely, covering purpose, control flow, and any notable edge cases.',
    },
    { role: 'user', content: code },
  ];
  return provider.complete(messages);
}

export async function fixCode(config: JaikiConfig, code: string): Promise<string> {
  const provider = getProvider(config.provider);
  ensureConfigured(provider.name, config.provider);
  const messages: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are a senior software engineer. Find and fix bugs in the given code. Return the corrected code followed by a short bullet list explaining each fix.',
    },
    { role: 'user', content: code },
  ];
  return provider.complete(messages);
}

export async function generateCode(config: JaikiConfig, description: string): Promise<string> {
  const provider = getProvider(config.provider);
  ensureConfigured(provider.name, config.provider);
  const messages: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are a senior software engineer. Generate clean, production-quality code for the given request. Include brief usage notes if helpful.',
    },
    { role: 'user', content: description },
  ];
  return provider.complete(messages);
}

/** Maintains a lightweight in-memory conversation for the interactive `chat` command. */
export class ChatSession {
  private history: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are Jaiki CLI, a concise and helpful AI assistant embedded in a developer terminal.',
    },
  ];

  constructor(private config: JaikiConfig) {}

  async send(userMessage: string): Promise<string> {
    const provider = getProvider(this.config.provider);
    ensureConfigured(provider.name, this.config.provider);

    this.history.push({ role: 'user', content: userMessage });
    const reply = await provider.complete(this.history);
    this.history.push({ role: 'assistant', content: reply });
    return reply;
  }

  reset(): void {
    this.history = this.history.slice(0, 1);
  }
}

function ensureConfigured(providerName: AIProviderName, configuredName: AIProviderName): void {
  const provider = getProvider(configuredName);
  if (!provider.isConfigured()) {
    const envVar = providerName === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY';
    throw new Error(
      `Provider "${providerName}" is not configured. Set ${envVar} in your .env file, or run "config provider <name>" to switch providers.`
    );
  }
}
