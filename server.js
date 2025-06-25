const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ 1. Meta Webhook Verification (GET)
app.get('/whatsapp-inbound', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === 'kaapav_verify_2024') {
    console.log('✅ Meta Webhook Verified!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Meta Verification Failed:', req.query);
    res.sendStatus(403);
  }
});

// ✅ 2. Incoming WhatsApp Messages (POST → Forward to n8n PRODUCTION URL)
app.post('/whatsapp-inbound', async (req, res) => {
  try {
    console.log('✅ Incoming WhatsApp POST:', JSON.stringify(req.body));

    // ✅ Your PRODUCTION n8n Webhook URL (LIVE WORKFLOW ONLY)
    const n8nWebhookUrl = 'https://kaapav-bot.onrender.com/webhook/whatsapp-inbound';

    await axios.post(n8nWebhookUrl, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Successfully forwarded to n8n');
    res.status(200).send('✅ POST forwarded to n8n');
  } catch (error) {
    console.error('❌ Error forwarding to n8n:', error.message);
    res.status(500).send('❌ Error forwarding to n8n');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Kaapav Webhook Server running on port ${PORT}`);
});
