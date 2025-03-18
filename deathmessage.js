// import express from 'express';
// import { Configuration, OpenAIApi } from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const port = 5000;

// app.use(express.json());

// // OpenAI configuration
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// // API route
// app.post('/generate', async (req, res) => {
//   const { characterName } = req.body;

//   try {
//     const prompt = `Generate a dramatic, funny, or epic death message for ${characterName} in exactly 25 words.`;
//     const response = await openai.createCompletion({
//       model: 'gpt-4-turbo',
//       prompt: prompt,
//       max_tokens: 50,
//       temperature: 0.8,
//     });

//     const deathMessage = response.data.choices[0].text.trim();
//     console.log(`Generated Death Message for ${characterName}: ${deathMessage}`);

//     res.json({ message: deathMessage });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Error generating death message.');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const axios = require("axios");

const generateDeathMessage = async (playerName) => {
  const prompt = `Create a humorous and dramatic short story about how ${playerName} was eliminated in a Mafia game. Make it fun and engaging.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error generating death message:", error);
    return `${playerName} has been eliminated.`;
  }
};

module.exports = generateDeathMessage;
