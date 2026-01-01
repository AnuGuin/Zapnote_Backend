import { z } from 'zod';

export const semanticSearchSchema = z.object({
  body: z.object({
    query: z.string().min(1).max(500),
    limit: z.number().int().min(1).max(50).default(20),
    filters: z
      .object({
        contentType: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
      .optional(),
  }),
  params: z.object({
    workspaceId: z.string().uuid(),
  }),
});

export interface SearchResult {
  id: string;
  title: string;
  summary: string | null;
  sourceUrl: string;
  contentType: string;
  similarity: number;
  tags: string[];
  createdAt: Date;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
}