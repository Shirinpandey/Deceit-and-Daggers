import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API route
app.post('/generate', async (req, res) => {
  const { characterName } = req.body;

  try {
    const prompt = `Generate a dramatic, funny, or epic death message for ${characterName} in exactly 25 words.`;
    const response = await openai.createCompletion({
      model: 'gpt-4-turbo',
      prompt: prompt,
      max_tokens: 50,
      temperature: 0.8,
    });

    const deathMessage = response.data.choices[0].text.trim();
    console.log(`Generated Death Message for ${characterName}: ${deathMessage}`);

    res.json({ message: deathMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating death message.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
