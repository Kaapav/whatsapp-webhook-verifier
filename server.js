const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Meta GET Webhook Verification
app.get('/whatsapp-inbound', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === 'kaapav_verify_2024') {
    console.log('✅ Meta Webhook Verified!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification failed:', req.query);
    res.sendStatus(403);
  }
});

// ✅ POST: Forward WhatsApp Webhook to n8n
app.post('/whatsapp-inbound', async (req, res) => {
  try {
    console.log('✅ Incoming WhatsApp POST:', JSON.stringify(req.body));

    // Replace this with your n8n webhook URL
    const n8nWebhookUrl = 'https://kaapav-bot.onrender.com/webhook/whatsapp-inbound';

    await axios.post(n8nWebhookUrl, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).send('✅ POST forwarded to n8n');
  } catch (err) {
    console.error('❌ Forwarding failed:', err.message);
    res.status(500).send('❌ Error forwarding to n8n');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Kaapav Webhook Server running on ${PORT}`);
});
