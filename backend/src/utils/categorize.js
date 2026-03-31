const CATEGORY_KEYWORDS = {
  ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural', 'gpt', 'llm', 'chatgpt', 'openai', 'anthropic', 'claude'],
  web: ['web', 'javascript', 'typescript', 'react', 'vue', 'angular', 'nextjs', 'html', 'css', 'frontend', 'backend', 'node', 'deno', 'bun'],
  mobile: ['mobile', 'ios', 'android', 'swift', 'kotlin', 'flutter', 'react native'],
  devops: ['devops', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'aws', 'azure', 'gcp', 'cloud', 'terraform', 'infrastructure'],
  security: ['security', 'vulnerability', 'hack', 'breach', 'encryption', 'privacy', 'cybersecurity', 'malware'],
  programming: ['rust', 'golang', 'python', 'java', 'c++', 'algorithm', 'data structure', 'compiler', 'open source', 'github'],
  startups: ['startup', 'funding', 'venture', 'ipo', 'acquisition', 'valuation', 'series a', 'series b', 'unicorn'],
};

function categorizeArticle(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();

  let bestCategory = 'general';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

module.exports = { categorizeArticle };
