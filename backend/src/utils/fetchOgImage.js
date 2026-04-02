const cheerio = require('cheerio');

async function fetchOgImage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TechPulseBot/1.0)',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return '';

    const html = await res.text();
    const $ = cheerio.load(html);

    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      '';

    return ogImage;
  } catch {
    return '';
  }
}

module.exports = { fetchOgImage };
