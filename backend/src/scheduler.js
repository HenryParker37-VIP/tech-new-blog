const cron = require('node-cron');
const { runAllScrapers, autoPublishArticles } = require('./scrapers');

function startScheduler() {
  // Run every 6 hours: at 0:00, 6:00, 12:00, 18:00
  cron.schedule('0 */6 * * *', async () => {
    console.log(`\n[SCHEDULER] Cron job triggered at ${new Date().toISOString()}`);
    try {
      await runAllScrapers();
      await autoPublishArticles(10);
    } catch (error) {
      console.error('[SCHEDULER] Error:', error.message);
    }
  });

  console.log('[SCHEDULER] Cron job scheduled: every 6 hours');
}

module.exports = { startScheduler };
