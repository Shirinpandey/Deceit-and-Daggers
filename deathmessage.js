const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

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
  const { characterName, scenario } = req.body;

  try {
    const prompt = `Generate a dramatic, funny, or epic death message for ${characterName} in the following scenario: ${scenario}.`;
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt: prompt,
      max_tokens: 50,
      temperature: 0.8,
    });

    res.json({ message: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating death message.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
