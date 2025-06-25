const express = require('express');
const app = express();

app.get('/verify-hook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Received Meta Verification Request:', req.query);

  if (mode === 'subscribe' && token === 'kaapav_verify_2024') {
    console.log('✅ Verification Passed!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification Failed');
    res.status(403).send('Verification failed');
  }
});

app.get('/', (req, res) => {
  res.send('Kaapav Webhook Verifier Running ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
