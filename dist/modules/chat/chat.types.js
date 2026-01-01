import { z } from 'zod';
export const createConversationSchema = z.object({
    params: z.object({
        workspaceId: z.string().uuid(),
    }),
    body: z.object({
        title: z.string().max(200).optional(),
    }),
});
export const sendMessageSchema = z.object({
    params: z.object({
        workspaceId: z.string().uuid(),
        conversationId: z.string().uuid(),
    }),
    body: z.object({
        message: z.string().min(1).max(2000),
    }),
});
export const getMessagesSchema = z.object({
    params: z.object({
        workspaceId: z.string().uuid(),
        conversationId: z.string().uuid(),
    }),
    query: z.object({
        limit: z.string().transform(Number).default(50),
    }),
});
//# sourceMappingURL=chat.types.js.map