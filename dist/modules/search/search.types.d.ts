import { z } from 'zod';
export declare const semanticSearchSchema: z.ZodObject<{
    body: z.ZodObject<{
        query: z.ZodString;
        limit: z.ZodDefault<z.ZodNumber>;
        filters: z.ZodOptional<z.ZodObject<{
            contentType: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
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
//# sourceMappingURL=search.types.d.ts.map