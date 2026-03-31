const RssParser = require('rss-parser');
const { categorizeArticle } = require('../utils/categorize');
const slugify = require('slugify');

const parser = new RssParser();
const TC_RSS = 'https://techcrunch.com/feed/';

async function scrapeTechCrunch(limit = 15) {
  const articles = [];

  try {
    const feed = await parser.parseURL(TC_RSS);
    const items = feed.items.slice(0, limit);

    for (const item of items) {
      if (!item.title) continue;

      // Extract image from content snippet if available
      let image = '';
      if (item['content:encoded']) {
        const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) image = imgMatch[1];
      }

      // Clean description HTML
      let description = item.contentSnippet || item.content || '';
      description = description.replace(/<[^>]*>/g, '').slice(0, 300);

      articles.push({
        title: item.title,
        description,
        content: '',
        link: item.link,
        source: 'techcrunch',
        image,
        category: categorizeArticle(item.title, description),
        slug: slugify(item.title, { lower: true, strict: true }).slice(0, 100),
        scraped_at: new Date(),
      });
    }
  } catch (error) {
    console.error('TechCrunch scraper error:', error.message);
    throw error;
  }

  return articles;
}

module.exports = { scrapeTechCrunch };
