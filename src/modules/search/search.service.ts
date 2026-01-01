import  prisma  from '../../config/db.js';
import { redis, CacheKeys, CACHE_TTL } from '../../config/redis.js';
import { generateEmbeddingCached } from '../../services/ai/embedding.service.js';
import { vectorSearch , hybridSearch } from '../../services/ai/vector.service.js';
import { logger } from '../../utils/logger.js';
import { SearchResult, SearchResponse } from './search.types.js';


export async function semanticSearch(
  query: string,
  workspaceId: string,
  limit: number = 20,
  filters?: {
    contentType?: string;
    tags?: string[];
  }
): Promise<SearchResponse> {
  const cacheKey = CacheKeys.searchResults(query, workspaceId);

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Search cache HIT: ${query}`);
      return JSON.parse(cached as string);
    }

    logger.debug(`Search cache MISS: ${query}`);

    const queryEmbedding = await generateEmbeddingCached(query);

    const rawResults = await vectorSearch(
      queryEmbedding,
      workspaceId,
      limit,
      filters
    );

    const itemIds = rawResults.map((r: any) => r.id);
    const tagsData = await prisma.tagOnItem.findMany({
      where: { itemId: { in: itemIds } },
      include: { tag: true },
    });

    const tagsByItem = tagsData.reduce((acc, t) => {
      const itemTags = (acc[t.itemId] ??= []);
      itemTags.push(t.tag.name);
      return acc;
    }, {} as Record<string, string[]>);


    const results: SearchResult[] = rawResults.map((r: any) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      sourceUrl: r.sourceUrl,
      contentType: r.contentType,
      similarity: parseFloat(r.similarity),
      tags: tagsByItem[r.id] || [],
      createdAt: r.createdAt,
    }));


    let filteredResults = results;
    if (filters?.tags && filters.tags.length > 0) {
      filteredResults = results.filter((r) =>
        filters.tags!.some((tag) => r.tags.includes(tag))
      );
    }

    const response: SearchResponse = {
      query,
      results: filteredResults,
      totalResults: filteredResults.length,
    };


    await redis.setex(cacheKey, CACHE_TTL.SEARCH_RESULTS, JSON.stringify(response));

    logger.info(`Semantic search completed: ${filteredResults.length} results`);
    return response;
  } catch (error) {
    logger.error('Semantic search error:', error);
    throw error;
  }
}


export async function performHybridSearch(
  query: string,
  workspaceId: string,
  limit: number = 20
): Promise<SearchResponse> {
  try {
    const queryEmbedding = await generateEmbeddingCached(query);

    const rawResults = await hybridSearch(queryEmbedding, query, workspaceId, limit);

    const itemIds = rawResults.map((r: any) => r.id);
    const tagsData = await prisma.tagOnItem.findMany({
      where: { itemId: { in: itemIds } },
      include: { tag: true },
    });

    const tagsByItem = tagsData.reduce((acc, t) => {
      const itemTags = (acc[t.itemId] ??= []);
      itemTags.push(t.tag.name);
      return acc;
    }, {} as Record<string, string[]>);

    const results: SearchResult[] = rawResults.map((r: any) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      sourceUrl: r.sourceUrl,
      contentType: r.contentType,
      similarity: parseFloat(r.combined_score),
      tags: tagsByItem[r.id] || [],
      createdAt: r.createdAt,
    }));

    logger.info(`Hybrid search completed: ${results.length} results`);
    return {
      query,
      results,
      totalResults: results.length,
    };
  } catch (error) {
    logger.error('Hybrid search error:', error);
    throw error;
  }
}