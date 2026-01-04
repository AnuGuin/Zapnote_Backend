import { generateWithFlash } from './gemini.service.js';
import { GENERATION_CONFIG } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';
export async function classifyContent(content, url) {
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
        const validTypes = [
            'ARTICLE',
            'VIDEO',
            'AUDIO',
            'SOCIAL_POST',
            'DOCUMENT',
            'CODE',
        ];
        if (validTypes.includes(classification)) {
            logger.info(`Content classified as: ${classification}`);
            return classification;
        }
        logger.warn(`Invalid classification: ${classification}, defaulting to OTHER`);
        return 'OTHER';
    }
    catch (error) {
        logger.error('Classification error:', error);
        return 'OTHER';
    }
}
//# sourceMappingURL=classifier.service.js.map