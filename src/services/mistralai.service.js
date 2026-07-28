import { Mistral } from '@mistralai/mistralai';
import { mistralApiKey } from '../config/env.js';

const client = new Mistral({ apiKey: mistralApiKey });

export async function streamChat(messages) {
  return client.chat.stream({
    model: 'mistral-small-latest', 
    messages,
  });
}