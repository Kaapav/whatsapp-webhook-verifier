const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ GET - Meta Verification Handler
app.get('/whatsapp-inbound', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === 'kaapav_verify_2024') {
    console.log('✅ Meta Webhook Verified Successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Meta Webhook Verification Failed!');
    res.sendStatus(403);
  }
});

// ✅ POST - Incoming WhatsApp Webhook Forwarder to n8n
app.post('/whatsapp-inbound', async (req, res) => {
  try {
    console.log('✅ Incoming WhatsApp POST:', JSON.stringify(req.body));

    // ✅ Forward to n8n (replace this with your actual n8n POST webhook URL)
    const n8nWebhookUrl = 'https://kaapav-bot.onrender.com/webhook/whatsapp-inbound';

    await axios.post(n8nWebhookUrl, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.status(200).send('POST forwarded to n8n ✅');
  } catch (error) {
    console.error('❌ Error forwarding POST to n8n:', error.message);
    res.status(500).send('Error forwarding to n8n ❌');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Kaapav Meta Webhook Server Running on Port ${PORT}`);
});
