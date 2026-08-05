import { streamChat } from '../services/mistralai.service.js';

export async function sendMessage(req, res) {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid message format.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const responseStream = await streamChat(messages);

        for await (const chunk of responseStream) {
            const content = chunk.data?.choices?.[0]?.delta?.content;

            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.end();

    } catch (error) {
        console.error('Mistral API Error:', error);
        res.write(`Data: ${JSON.stringify({ error: 'Server error occurred.' })}\n\n`);
        res.end();
    }
}