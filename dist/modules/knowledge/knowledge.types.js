import { z } from 'zod';
import { ContentType, ProcessingStatus } from '@prisma/client';
export const createKnowledgeItemSchema = z.object({
    body: z.object({
        sourceUrl: z.string().url(),
        userIntent: z.string().max(500).optional(),
    }),
    params: z.object({
        workspaceId: z.string().uuid(),
    }),
});
export const updateKnowledgeItemSchema = z.object({
    body: z.object({
        userIntent: z.string().max(500).optional(),
    }),
    params: z.object({
        workspaceId: z.string().uuid(),
        itemId: z.string().uuid(),
    }),
});
export const getKnowledgeItemsSchema = z.object({
    params: z.object({
        workspaceId: z.string().uuid(),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        type: z.nativeEnum(ContentType).optional(),
        status: z.nativeEnum(ProcessingStatus).optional(),
    }),
});
export const knowledgeItemIdSchema = z.object({
    params: z.object({
        workspaceId: z.string().uuid(),
        itemId: z.string().uuid(),
    }),
});
//# sourceMappingURL=knowledge.types.js.map