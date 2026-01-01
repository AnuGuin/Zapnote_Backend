import { logger } from '../../utils/logger.js';
import { ScrapedData, ScraperResult } from './scraper.types.js';
import { scrapeGenericWebsite } from './scraping/generic.scraper.js';
import { scrapeYouTube } from './scraping/youtube.scraper.js';
import { scrapeTwitter } from './scraping/twitter.scraper.js';


export async function scrapeContent(url: string): Promise<ScraperResult> {
  try {
    logger.info(`Starting scrape for: ${url}`);

    let data: ScrapedData;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      data = await scrapeYouTube(url);
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      data = await scrapeTwitter(url);
    } else {
      data = await scrapeGenericWebsite(url);
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    logger.error(`Scraping failed for ${url}:`, error);
    return {
      success: false,
      error: error.message || 'Unknown scraping error',
    };
  }
}