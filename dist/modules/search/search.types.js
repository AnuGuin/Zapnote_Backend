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
//# sourceMappingURL=search.types.js.map