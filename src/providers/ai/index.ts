import { AIProvider, AIProviderName } from '../../types';
import { OpenAIProvider } from './openai';
import { GeminiProvider } from './gemini';

/**
 * Central registry of available AI providers. To add a new provider:
 *   1. Create providers/ai/<name>.ts extending AIProviderBase.
 *   2. Import and add it to the `providers` map below.
 * No other code needs to change — commands look providers up by name.
 */
const providers: Record<AIProviderName, AIProvider> = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
};

export function getProvider(name: AIProviderName): AIProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown AI provider "${name}".`);
  }
  return provider;
}

export function listProviders(): AIProvider[] {
  return Object.values(providers);
}

export { AIProvider };
