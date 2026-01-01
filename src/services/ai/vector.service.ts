import  prisma  from '../../config/db.js';
import { logger } from '../../utils/logger.js';


export async function vectorSearch(
  embedding: number[],
  workspaceId: string,
  limit: number = 20,
  filters?: {
    contentType?: string;
    tags?: string[];
  }
) {
  try {
    let whereClause = `ki."workspaceId" = '${workspaceId}'`;

    if (filters?.contentType) {
      whereClause += ` AND ki."contentType" = '${filters.contentType}'`;
    }

    const query = `
      SELECT 
        ki.id,
        COALESCE(ki.metadata->>'scrapedTitle', ki."userIntent", ki."sourceUrl") AS title,
        ki.summary,
        ki."sourceUrl",
        ki."contentType",
        ki."createdAt",
        1 - (e.vector <=> $1::vector) AS similarity
      FROM "KnowledgeItem" ki
      JOIN "Embedding" e ON e."knowledgeItemId" = ki.id
      WHERE ${whereClause}
      ORDER BY e.vector <=> $1::vector
      LIMIT $2
    `;

    const results = await prisma.$queryRawUnsafe(
      query,
      `[${embedding.join(',')}]`,
      limit
    );

    logger.info(`Vector search returned ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Vector search error:', error);
    throw error;
  }
}

export async function hybridSearch(
  embedding: number[],
  keywords: string,
  workspaceId: string,
  limit: number = 20
) {
  try {
    const query = `
      SELECT 
        ki.id,
        COALESCE(ki.metadata->>'scrapedTitle', ki."userIntent", ki."sourceUrl") AS title,
        ki.summary,
        ki."sourceUrl",
        ki."contentType",
        ki."createdAt",
        (1 - (e.vector <=> $1::vector)) * 0.7 AS vector_score,
        ts_rank(
          to_tsvector('english', COALESCE(ki.metadata->>'scrapedTitle', ki."userIntent", '') || ' ' || COALESCE(ki.summary, '')),
          plainto_tsquery('english', $2)
        ) * 0.3 AS text_score,
        (1 - (e.vector <=> $1::vector)) * 0.7 + 
        ts_rank(
          to_tsvector('english', COALESCE(ki.metadata->>'scrapedTitle', ki."userIntent", '') || ' ' || COALESCE(ki.summary, '')),
          plainto_tsquery('english', $2)
        ) * 0.3 AS combined_score
      FROM "KnowledgeItem" ki
      JOIN "Embedding" e ON e."knowledgeItemId" = ki.id
      WHERE ki."workspaceId" = $3
      ORDER BY combined_score DESC
      LIMIT $4
    `;

    const results = await prisma.$queryRawUnsafe(
      query,
      `[${embedding.join(',')}]`,
      keywords,
      workspaceId,
      limit
    );

    logger.info(`Hybrid search returned ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Hybrid search error:', error);
    throw error;
  }
}