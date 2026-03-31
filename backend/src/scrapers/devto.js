const { categorizeArticle } = require('../utils/categorize');
const slugify = require('slugify');

const DEVTO_API = 'https://dev.to/api/articles';

async function scrapeDevTo(limit = 15) {
  const articles = [];

  try {
    const res = await fetch(`${DEVTO_API}?per_page=${limit}&top=1`);
    const posts = await res.json();

    for (const post of posts) {
      if (!post.title) continue;

      articles.push({
        title: post.title,
        description: post.description || '',
        content: '',
        link: post.url,
        source: 'devto',
        image: post.cover_image || post.social_image || '',
        category: categorizeArticle(post.title, post.description || ''),
        slug: slugify(post.title, { lower: true, strict: true }).slice(0, 100),
        scraped_at: new Date(),
      });
    }
  } catch (error) {
    console.error('Dev.to scraper error:', error.message);
    throw error;
  }

  return articles;
}

module.exports = { scrapeDevTo };
