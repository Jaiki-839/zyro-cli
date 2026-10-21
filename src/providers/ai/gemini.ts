import axios from 'axios';
import { AIMessage, AIProviderName } from '../../types';
import { AIProviderBase } from './base';
import { configManager } from '../../config/config';

/**
 * Google Gemini generative-content provider.
 * Docs: https://ai.google.dev/api/rest/v1/models/generateContent
 */
export class GeminiProvider extends AIProviderBase {
  readonly name: AIProviderName = 'gemini';

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY || configManager.get().geminiApiKey);
  }

  async complete(messages: AIMessage[]): Promise<string> {
    const apiKey = this.requireEnv('GEMINI_API_KEY', configManager.get().geminiApiKey);
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // Gemini has no "system" role — fold system messages into the first user turn.
    const systemPreamble = messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n');

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    if (systemPreamble && contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = `${systemPreamble}\n\n${contents[0].parts[0].text}`;
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { contents },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini returned an empty response.');
      }
      return text.trim();
    } catch (err: any) {
      const apiMessage = err.response?.data?.error?.message;
      throw new Error(apiMessage || err.message || 'Unknown Gemini API error.');
    }
  }
}
