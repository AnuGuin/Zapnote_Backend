import { generateWithFlash } from './gemini.service.js';
import { GENERATION_CONFIG } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';
import { ContentType } from '@prisma/client';


export async function classifyContent(content: string, url: string): Promise<ContentType> {
  try {
    const prompt = `Analyze this content and URL, then classify it into ONE of these categories:
- ARTICLE (blog posts, news articles, web pages)
- VIDEO (YouTube videos, Vimeo, etc.)
- AUDIO (podcasts, music, audio files)
- SOCIAL POST (Twitter/X, LinkedIn, Facebook posts)
- CODE (GitHub repos, code snippets)
- IMAGE (images, infographics)

URL: ${url}
Content preview: ${content.slice(0, 500)}

Reply with ONLY the category name, nothing else.`;

    const response = await generateWithFlash(prompt, GENERATION_CONFIG.CLASSIFICATION);
    
    const classification = response.trim().toUpperCase();
    
    const validTypes: ContentType[] = [
      'ARTICLE',
      'VIDEO',
      'AUDIO',
      'SOCIAL_POST',
      'DOCUMENT',
      'CODE',
    ];

    if (validTypes.includes(classification as ContentType)) {
      logger.info(`Content classified as: ${classification}`);
      return classification as ContentType;
    }

    logger.warn(`Invalid classification: ${classification}, defaulting to OTHER`);
    return 'OTHER';
  } catch (error) {
    logger.error('Classification error:', error);
    return 'OTHER';
  }
}