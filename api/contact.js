import { getVisitorInfo } from './_visitor.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const info = getVisitorInfo(req);

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not set');
    return res.status(500).json({ error: 'Contact service is not configured.' });
  }

  {
    try {
      const payload = {
        embeds: [
          {
            title: '📩 New Contact Form Submission',
            color: 3066993, // Green
            fields: [
              { name: 'Name', value: name, inline: true },
              { name: 'Email', value: email, inline: true },
              { name: 'Message', value: message },
              { name: 'Location', value: info.location || 'Unknown', inline: true },
              { name: 'IP', value: info.ip || 'Unknown', inline: true },
              { name: 'Browser / OS', value: `${info.browser} / ${info.os}`, inline: true }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Discord API responded with status ${response.status}`);
      }
      
      return res.status(200).json({ success: true, message: 'Message forwarded to Discord Webhook!' });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: 'Failed to send message via Webhook.' });
    }
  }
}
