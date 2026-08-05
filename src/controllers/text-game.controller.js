import { streamChat } from '../services/mistralai.service.js';

export async function summarizeDocument(req, res) {
  const { documentText } = req.body;

  if (!documentText || documentText.trim() === '') {
    return res.status(400).json({ error: 'No text provided.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const prompt = `Read the following text carefully and create a comprehensive summary.\n\nRequirements:\n- Preserve all key information and main ideas.\n- Remove repetition, digressions, and non-essential details.\n- Do not add opinions, assumptions, or information not present in the original text.\n- Maintain the original meaning and logical flow.\n- Include important numbers, dates, names, definitions, and technical terms whenever they are essential for understanding.\n- If something cannot be inferred from the text, do not speculate.\n- If the text contains arguments or a sequence of events, preserve their order.\n- Use clear, concise, and neutral language. \nOutput format: \nExecutive Summary Write a concise summary in 3–5 sentences. \nText:\n\n${documentText}`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const responseStream = await streamChat(messages);

    for await (const chunk of responseStream) {
      const content = chunk.data?.choices?.[0]?.delta?.content;

      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Błąd Mistral API:', error);
    res.write(`data: ${JSON.stringify({ error: 'Wystąpił błąd serwera.' })}\n\n`);
    res.end();
  }
}