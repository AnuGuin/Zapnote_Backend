import { logger } from '../../utils/logger.js';
import prisma from '../../config/db.js';
import { scrapeContent } from '../scrapper/scraper.service.js';
import { classifyContent } from '../ai/classifier.service.js';
import { generateSummary } from '../ai/summarizer.service.js';
import { generateEmbeddingCached } from '../ai/embedding.service.js';
import { extractTags } from '../ai/tagger.service.js';
import { redis, CacheKeys } from '../../config/redis.js';
import crypto from 'crypto';
const normalizeTagName = (tagName) => tagName?.toLowerCase().trim();
export async function processKnowledgeItem(knowledgeItemId) {
    logger.info(`Starting pipeline for item: ${knowledgeItemId}`);
    try {
        const item = await prisma.knowledgeItem.findUnique({
            where: { id: knowledgeItemId },
        });
        if (!item) {
            throw new Error('Item not found');
        }
        await prisma.knowledgeItem.update({
            where: { id: knowledgeItemId },
            data: { status: 'PROCESSING', errorMessage: null },
        });
        logger.info(`Scraping URL: ${item.sourceUrl}`);
        const scrapeResult = await scrapeContent(item.sourceUrl);
        if (!scrapeResult.success || !scrapeResult.data) {
            throw new Error(scrapeResult.error || 'Scraping failed');
        }
        logger.info(`Classifying content...`);
        const contentType = await classifyContent(scrapeResult.data.content, item.sourceUrl);
        await prisma.knowledgeItem.update({
            where: { id: knowledgeItemId },
            data: {
                scrapedContent: scrapeResult.data.content,
                contentType,
                metadata: {
                    ...(scrapeResult.data.metadata || {}),
                    scrapedTitle: scrapeResult.data.title,
                },
            },
        });
        logger.info(`Generating summary...`);
        const summary = await generateSummary(scrapeResult.data.content, item.userIntent || undefined);
        await prisma.knowledgeItem.update({
            where: { id: knowledgeItemId },
            data: { summary },
        });
        logger.info(`Generating embedding...`);
        const textToEmbed = [summary, scrapeResult.data.content.slice(0, 3000)]
            .filter(Boolean)
            .join('\n\n');
        const embedding = await generateEmbeddingCached(textToEmbed);
        const vectorLiteral = `[${embedding.join(',')}]`;
        const embeddingId = crypto.randomUUID();
        await prisma.$executeRaw `
      INSERT INTO "Embedding" ("id", "knowledgeItemId", "vector", "model")
      VALUES (${embeddingId}, ${knowledgeItemId}, CAST(${vectorLiteral} AS vector), ${'text-embedding-004'})
      ON CONFLICT ("knowledgeItemId") DO UPDATE
      SET "vector" = CAST(${vectorLiteral} AS vector), "model" = ${'text-embedding-004'}
    `;
        logger.info(`Extracting tags...`);
        const tagNames = await extractTags(scrapeResult.data.content, summary);
        logger.info(`Got ${tagNames.length} tags: ${tagNames.join(', ')}`);
        for (const tagName of tagNames) {
            const normalized = normalizeTagName(tagName);
            if (!normalized)
                continue;
            const tag = await prisma.tag.upsert({
                where: { name: normalized },
                create: { name: normalized },
                update: {},
            });
            await prisma.tagOnItem.upsert({
                where: {
                    itemId_tagId: {
                        itemId: knowledgeItemId,
                        tagId: tag.id,
                    },
                },
                create: {
                    itemId: knowledgeItemId,
                    tagId: tag.id,
                    addedByAI: true,
                },
                update: {},
            });
        }
        await prisma.knowledgeItem.update({
            where: { id: knowledgeItemId },
            data: { status: 'COMPLETED' },
        });
        await redis.del(CacheKeys.workspaceItems(item.workspaceId));
        logger.info(`Pipeline COMPLETED for: ${knowledgeItemId}`);
    }
    catch (error) {
        logger.error(`Pipeline FAILED for ${knowledgeItemId}:`, error);
        try {
            await prisma.knowledgeItem.update({
                where: { id: knowledgeItemId },
                data: { status: 'FAILED', errorMessage: error?.message || 'Processing failed' },
            });
        }
        catch {
            // ignore
        }
    }
}
export async function enqueueContentProcessing(knowledgeItemId) {
    logger.info(`Enqueuing processing for item: ${knowledgeItemId}`);
    setImmediate(() => {
        processKnowledgeItem(knowledgeItemId).catch((err) => {
            logger.error(`Pipeline crashed for ${knowledgeItemId}:`, err);
        });
    });
}
//# sourceMappingURL=queue.service.js.map