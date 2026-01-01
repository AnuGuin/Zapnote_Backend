import { generateWithFlash } from './gemini.service.js';
import { GENERATION_CONFIG } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';


export async function extractTags(content: string, summary: string): Promise<string[]> {
  try {
    const prompt = `Extract 3-5 relevant tags from this content. 
Each tag should be:
- 1-2 words maximum
- Relevant and specific
- Useful for categorization

Content summary: ${summary}
Full content preview: ${content.slice(0, 2000)}

Reply with ONLY the tags, comma-separated, nothing else.
Example: machine learning, AI, research, transformers`;

    const response = await generateWithFlash(prompt, GENERATION_CONFIG.TAGGING);

    const tags = response
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && tag.length <= 50)
      .slice(0, 5);

    logger.info(`Extracted ${tags.length} tags`);
    return tags;
  } catch (error) {
    logger.error('Tag extraction error:', error);
    return [];
  }
}