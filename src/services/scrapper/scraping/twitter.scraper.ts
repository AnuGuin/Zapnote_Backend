import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../../../utils/logger.js';
import { ScrapedData } from '../scraper.types.js';


export async function scrapeTwitter(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KnowledgeBot/1.0)',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const title = $('meta[property="og:title"]').attr('content') || 'Twitter Post';
    const description = $('meta[property="og:description"]').attr('content') || '';
    const image = $('meta[property="og:image"]').attr('content') || '';

    logger.info(`Successfully scraped Twitter post: ${url}`);

    return {
      title,
      content: description,
      type: 'SOCIAL_POST',
      metadata: {
        platform: 'Twitter/X',
        image,
      },
    };
  } catch (error) {
    logger.error(`Error scraping Twitter ${url}:`, error);
    throw new Error('Failed to scrape Twitter post');
  }
}