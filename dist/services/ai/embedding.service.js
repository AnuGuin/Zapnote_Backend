import { generateEmbedding as geminiEmbed } from './gemini.service.js';
import { redis, CacheKeys, CACHE_TTL } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';
export async function generateEmbeddingCached(text) {
    const cacheKey = CacheKeys.embedding(text);
    try {
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                logger.debug(`Embedding cache HIT`);
                return typeof cached === 'string' ? JSON.parse(cached) : cached;
            }
        }
        catch (cacheReadError) {
            logger.warn('Embedding cache read skipped (redis unavailable)');
        }
        logger.debug(`Embedding cache MISS`);
        const embedding = await geminiEmbed(text.slice(0, 10000));
        try {
            await redis.set(cacheKey, embedding, { ex: CACHE_TTL.EMBEDDINGS });
        }
        catch {
            logger.warn('Embedding cache write skipped (redis unavailable)');
        }
        return embedding;
    }
    catch (error) {
        logger.error('Embedding generation error:', error);
        throw error;
    }
}
//# sourceMappingURL=embedding.service.js.map