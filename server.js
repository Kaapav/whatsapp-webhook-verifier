const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ 1. GET - Meta Webhook Verification
app.get('/whatsapp-inbound', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === 'kaapav_verify_2024') {
    console.log('✅ Meta Webhook Verified Successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Meta Verification Failed: Token or Mode Mismatch');
    res.sendStatus(403);
  }
});

// ✅ 2. POST - Forward WhatsApp incoming messages to n8n
app.post('/whatsapp-inbound', async (req, res) => {
  try {
    console.log('✅ Incoming WhatsApp POST:', JSON.stringify(req.body));

    // ✅ Your actual n8n POST Webhook URL (update if needed)
    const n8nWebhookUrl = 'https://kaapav-bot.onrender.com/webhook/whatsapp-inbound';

    await axios.post(n8nWebhookUrl, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.status(200).send('POST received and forwarded to n8n ✅');
  } catch (error) {
    console.error('❌ Error forwarding to n8n:', error.message);
    res.status(500).send('Failed to forward to n8n ❌');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Kaapav Webhook Server Running on Port ${PORT}`);
});
