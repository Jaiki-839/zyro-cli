import { AIMessage, AIProvider, AIProviderName } from '../../types';

/**
 * Abstract base class for AI providers. Concrete providers (OpenAI,
 * Gemini, ...) extend this and implement `complete()`. Adding a new
 * provider only requires: create a class extending AIProviderBase,
 * implement isConfigured()/complete(), then register it in
 * `providers/ai/index.ts`.
 */
export abstract class AIProviderBase implements AIProvider {
  abstract readonly name: AIProviderName;
  abstract isConfigured(): boolean;
  abstract complete(messages: AIMessage[]): Promise<string>;

  protected requireEnv(varName: string, configFallback?: string): string {
    const value = process.env[varName] || configFallback;
    if (!value) {
      const configKeyName = varName === 'GEMINI_API_KEY' ? 'gemini-key' : 'openai-key';
      throw new Error(
        `Missing API key for ${varName}. Set it with "config set ${configKeyName} <KEY>" or export ${varName}.`
      );
    }
    return value;
  }
}
