// Shared helper: extract visitor details from a Vercel serverless request.
// All of this is data the browser/CDN already sends on every request — no
// client cooperation required.
export function getVisitorInfo(req) {
  const h = req.headers || {};
  const get = (k) => h[k] || h[k.toLowerCase()] || "";

  // Vercel populates x-forwarded-for with the real client IP (first entry).
  const ip = (get("x-forwarded-for").split(",")[0] || get("x-real-ip") || "").trim();

  // Vercel edge geo headers (available on all deployments).
  const country = get("x-vercel-ip-country");
  const region = get("x-vercel-ip-country-region");
  const city = decodeURIComponent(get("x-vercel-ip-city") || "");
  const latitude = get("x-vercel-ip-latitude");
  const longitude = get("x-vercel-ip-longitude");

  const userAgent = get("user-agent");
  const referer = get("referer") || get("referrer");
  const language = get("accept-language").split(",")[0];

  return {
    ip,
    location: [city, region, country].filter(Boolean).join(", "),
    latitude,
    longitude,
    userAgent,
    browser: parseBrowser(userAgent),
    os: parseOS(userAgent),
    device: /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "Mobile" : "Desktop",
    referer,
    language,
  };
}

function parseBrowser(ua = "") {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Unknown";
}

function parseOS(ua = "") {
  if (/Windows/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}
