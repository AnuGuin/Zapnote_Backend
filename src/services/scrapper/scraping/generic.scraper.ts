import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../../../utils/logger.js';
import { ScrapedData } from '../scraper.types.js';


export async function scrapeGenericWebsite(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KnowledgeBot/1.0)',
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    $('script, style, nav, footer, iframe, ads').remove();

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      'Untitled';

    let content = '';

    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      'body',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }

    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()
      .slice(0, 50000); // Limit to 50k chars

    const metadata = {
      description: $('meta[name="description"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      publishedDate: $('meta[property="article:published_time"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      siteName: $('meta[property="og:site_name"]').attr('content') || '',
    };

    logger.info(`Successfully scraped generic website: ${url}`);

    return {
      title: title.trim(),
      content,
      type: 'ARTICLE',
      metadata,
    };
  } catch (error) {
    logger.error(`Error scraping generic website ${url}:`, error);
    throw new Error('Failed to scrape website');
  }
}