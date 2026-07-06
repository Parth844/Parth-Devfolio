import { getVisitorInfo } from "./_visitor.js";

// Fire-and-forget visit logger. The client pings this once on page load; the
// server derives location/browser/device from request headers and forwards a
// summary to Discord. Uses TRACKING_WEBHOOK_URL if set, else falls back to the
// contact DISCORD_WEBHOOK_URL.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const info = getVisitorInfo(req);

  // Optional extra detail the client can send (screen size, timezone, path).
  const client = typeof req.body === "object" && req.body ? req.body : {};

  const webhookUrl =
    process.env.TRACKING_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const mapLink =
        info.latitude && info.longitude
          ? `[${info.latitude}, ${info.longitude}](https://www.google.com/maps?q=${info.latitude},${info.longitude})`
          : "n/a";

      const payload = {
        embeds: [
          {
            title: "👁️ New Visitor",
            color: 3447003, // Blue
            fields: [
              { name: "Location", value: info.location || "Unknown", inline: true },
              { name: "IP", value: info.ip || "Unknown", inline: true },
              { name: "Coordinates", value: mapLink, inline: false },
              { name: "Browser", value: info.browser, inline: true },
              { name: "OS", value: info.os, inline: true },
              { name: "Device", value: info.device, inline: true },
              { name: "Page", value: client.path || "/", inline: true },
              { name: "Referrer", value: info.referer || "Direct", inline: true },
              { name: "Language", value: info.language || "n/a", inline: true },
              { name: "Screen", value: client.screen || "n/a", inline: true },
              { name: "Timezone", value: client.timezone || "n/a", inline: true },
            ],
            description: info.userAgent ? `\`${info.userAgent}\`` : undefined,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Tracking webhook error:", error);
      // Never fail the visitor's experience over a tracking hiccup.
    }
  }

  return res.status(200).json({ ok: true });
}
