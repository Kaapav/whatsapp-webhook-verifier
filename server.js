const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/whatsapp-inbound', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === 'kaapav_verify_2024') {
    console.log('✅ Webhook Verified by Meta!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification Failed!');
    res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Kaapav Webhook Verifier Running on port ${PORT}`);
});
