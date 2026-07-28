import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Mistral } from '@mistralai/mistralai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Włączenie CORS, aby front-end mógł komunikować się z back-endem
app.use(cors());
app.use(express.json());

// Serwowanie plików statycznych (front-endu) z folderu 'public'
app.use(express.static('public'));

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// Endpoint obsługujący czat ze streamingiem
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Nieprawidłowy format wiadomości.' });
  }

  // Ustawienie nagłówków dla Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const responseStream = await client.chat.stream({
      model: 'mistral-small-latest', // Ekonomiczny i szybki model dla darmowego planu
      messages: messages,
    });

    for await (const chunk of responseStream) {
      // Bezpieczne wyciąganie zawartości z uwzględnieniem nowej struktury SDK
      const content = chunk.choices?.[0]?.delta?.content || chunk.data?.choices?.[0]?.delta?.content;

      if (content) {
        // Format SSE wymaga wysyłania danych z przedrostkiem "data: " i dwoma znakami nowej linii
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.end();
  } catch (error) {
    console.error('Błąd Mistral API:', error);
    res.write(`data: ${JSON.stringify({ error: 'Wystąpił błąd serwera.' })}\n\n`);
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});