const Article = require('../models/Article');
const ScrapeLog = require('../models/ScrapeLog');
const { scrapeHackerNews } = require('./hackernews');
const { scrapeDevTo } = require('./devto');
const { scrapeTechCrunch } = require('./techcrunch');

async function runScraper(scraperFn, sourceName) {
  const log = await ScrapeLog.create({ source: sourceName });

  try {
    const articles = await scraperFn();
    log.articles_found = articles.length;

    let saved = 0;
    for (const article of articles) {
      try {
        // Check for duplicates by link
        const exists = await Article.findOne({ link: article.link });
        if (!exists) {
          // Ensure unique slug
          let slug = article.slug;
          const slugExists = await Article.findOne({ slug });
          if (slugExists) {
            slug = `${slug}-${Date.now()}`;
          }
          await Article.create({ ...article, slug });
          saved++;
        }
      } catch (err) {
        log.scrape_errors.push({ message: err.message });
      }
    }

    log.articles_saved = saved;
    log.status = 'completed';
    log.completed_at = new Date();
    await log.save();

    console.log(`[${sourceName}] Found ${articles.length}, saved ${saved} new articles`);
    return { found: articles.length, saved };
  } catch (error) {
    log.status = 'failed';
    log.scrape_errors.push({ message: error.message });
    log.completed_at = new Date();
    await log.save();

    console.error(`[${sourceName}] Scraper failed:`, error.message);
    return { found: 0, saved: 0, error: error.message };
  }
}

async function runAllScrapers() {
  console.log(`\n=== Starting scrape cycle at ${new Date().toISOString()} ===`);

  const results = await Promise.allSettled([
    runScraper(scrapeHackerNews, 'hackernews'),
    runScraper(scrapeDevTo, 'devto'),
    runScraper(scrapeTechCrunch, 'techcrunch'),
  ]);

  const summary = {
    hackernews: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason },
    devto: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason },
    techcrunch: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason },
  };

  console.log('=== Scrape cycle complete ===\n');
  return summary;
}

async function autoPublishArticles(limit = 10) {
  // Publish the most recent unpublished articles
  const unpublished = await Article.find({ is_published: false })
    .sort({ scraped_at: -1 })
    .limit(limit);

  let published = 0;
  for (const article of unpublished) {
    article.is_published = true;
    article.published_at = new Date();
    await article.save();
    published++;
  }

  console.log(`Auto-published ${published} articles`);
  return published;
}

module.exports = { runAllScrapers, autoPublishArticles };
