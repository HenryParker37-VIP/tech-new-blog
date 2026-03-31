const { categorizeArticle } = require('../utils/categorize');
const slugify = require('slugify');

const HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM = 'https://hacker-news.firebaseio.com/v0/item';

async function scrapeHackerNews(limit = 15) {
  const articles = [];

  try {
    const res = await fetch(HN_TOP_STORIES);
    const storyIds = await res.json();
    const topIds = storyIds.slice(0, limit);

    const storyPromises = topIds.map(async (id) => {
      try {
        const itemRes = await fetch(`${HN_ITEM}/${id}.json`);
        return await itemRes.json();
      } catch {
        return null;
      }
    });

    const stories = await Promise.all(storyPromises);

    for (const story of stories) {
      if (!story || !story.title || story.type !== 'story') continue;

      const title = story.title;
      const link = story.url || `https://news.ycombinator.com/item?id=${story.id}`;

      articles.push({
        title,
        description: `${story.score} points | ${story.descendants || 0} comments on Hacker News`,
        content: '',
        link,
        source: 'hackernews',
        image: '',
        category: categorizeArticle(title),
        slug: slugify(title, { lower: true, strict: true }).slice(0, 100),
        scraped_at: new Date(),
      });
    }
  } catch (error) {
    console.error('HackerNews scraper error:', error.message);
    throw error;
  }

  return articles;
}

module.exports = { scrapeHackerNews };
