import axios from 'axios';
import { AIMessage, AIProviderName } from '../../types';
import { AIProviderBase } from './base';
import { configManager } from '../../config/config';

/**
 * OpenAI chat completions provider.
 * Docs: https://platform.openai.com/docs/api-reference/chat
 */
export class OpenAIProvider extends AIProviderBase {
  readonly name: AIProviderName = 'openai';

  isConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY || configManager.get().openaiApiKey);
  }

  async complete(messages: AIMessage[]): Promise<string> {
    const apiKey = this.requireEnv('OPENAI_API_KEY', configManager.get().openaiApiKey);
    const model = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI returned an empty response.');
      }
      return content.trim();
    } catch (err: any) {
      const apiMessage = err.response?.data?.error?.message;
      throw new Error(apiMessage || err.message || 'Unknown OpenAI API error.');
    }
  }
}
