import { z } from 'zod';
export declare const createConversationSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const sendMessageSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        conversationId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        message: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getMessagesSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        conversationId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export interface MessageWithSources {
    id: string;
    role: string;
    content: string;
    sourceItemIds: string[];
    createdAt: Date;
    sources?: Array<{
        id: string;
        title: string;
        sourceUrl: string;
    }>;
}
export interface ConversationWithMessages {
    id: string;
    title: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: MessageWithSources[];
}
//# sourceMappingURL=chat.types.d.ts.map