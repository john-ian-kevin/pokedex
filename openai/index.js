import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/pokemon-advance-search', async (req, res) => {
  const { description } = req.body;

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [
        {
          role: 'system',
          content: `Help identify the Pokémon based on user descriptions.
          Respond with Pokémon names only. If 2 or more Pokémon match, return a list of names.
          If none match, respond with empty string.`,
        },
        { role: 'user', content: description },
      ],
      max_tokens: 30,
    });
    const result = response.choices[0].message.content.trim();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
