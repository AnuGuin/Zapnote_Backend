import { z } from 'zod';
import { ContentType, ProcessingStatus } from '@prisma/client';
export declare const createKnowledgeItemSchema: z.ZodObject<{
    body: z.ZodObject<{
        sourceUrl: z.ZodString;
        userIntent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateKnowledgeItemSchema: z.ZodObject<{
    body: z.ZodObject<{
        userIntent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        itemId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getKnowledgeItemsSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        type: z.ZodOptional<z.ZodEnum<{
            ARTICLE: "ARTICLE";
            VIDEO: "VIDEO";
            AUDIO: "AUDIO";
            SOCIAL_POST: "SOCIAL_POST";
            DOCUMENT: "DOCUMENT";
            CODE: "CODE";
            IMAGE: "IMAGE";
            OTHER: "OTHER";
        }>>;
        status: z.ZodOptional<z.ZodEnum<{
            PENDING: "PENDING";
            PROCESSING: "PROCESSING";
            COMPLETED: "COMPLETED";
            FAILED: "FAILED";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const knowledgeItemIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        itemId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export interface KnowledgeItemWithTags {
    id: string;
    sourceUrl: string;
    userIntent: string | null;
    summary: string | null;
    contentType: ContentType;
    status: ProcessingStatus;
    errorMessage: string | null;
    metadata: any;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    tags: Array<{
        id: string;
        name: string;
        addedByAI: boolean;
    }>;
}
//# sourceMappingURL=knowledge.types.d.ts.map