require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Gemini Server is running');
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log('User:', message);

  try {
    // Gemini endpoint (latest)
  const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are Kiran, an AI assistant created to help users. 
                   Always respond as 'Kiran' instead of mentioning Google or any company.`
          },
          { text: message }
        ]
      }
    ]
  },
  {
    headers: { 'Content-Type': 'application/json' }
  }
);



    // Extract bot reply safely
    const botReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error communicating with Gemini:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Error communicating with Gemini API' });
  }
});

app.listen(3000, () => console.log('✅ Gemini Server running on port 3000'));

