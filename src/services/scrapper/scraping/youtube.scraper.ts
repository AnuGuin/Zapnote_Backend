import axios from 'axios';
import { logger } from '../../../utils/logger.js';
import { ScrapedData } from '../scraper.types.js';
import { YoutubeTranscript } from 'youtube-transcript';

export async function scrapeYouTube(url: string): Promise<ScrapedData> {
  try {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }

    const videoId = videoIdMatch[1]!;

    //Get Metadata via OEmbed
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oembedUrl);
    const data = response.data;

    //Try to get Transcript
    let transcriptText = '';
    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcriptItems.map((item) => item.text).join(' ');
      logger.info(`Successfully fetched transcript for ${videoId}`);
    } catch (transcriptError) {
      logger.warn(`Failed to fetch transcript for ${videoId}:`, transcriptError);
      transcriptText = 'Transcript not available for this video.';
    }

    logger.info(`Successfully scraped YouTube video: ${videoId}`);

    return {
      title: data.title,
      content: `YouTube Video: ${data.title}\nChannel: ${data.author_name}\n\nTranscript:\n${transcriptText}`,
      type: 'VIDEO',
      metadata: {
        videoId,
        channelName: data.author_name,
        thumbnailUrl: data.thumbnail_url,
        width: data.width,
        height: data.height,
      },
    };
  } catch (error) {
    logger.error(`Error scraping YouTube ${url}:`, error);
    throw new Error('Failed to scrape YouTube video');
  }
}