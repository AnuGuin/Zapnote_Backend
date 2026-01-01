import { ConversationWithMessages } from './chat.types.js';
export declare function createConversation(userId: string, workspaceId: string, title?: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string | null;
}>;
export declare function getUserConversations(userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        messages: number;
    };
    title: string | null;
}[]>;
export declare function getConversationWithMessages(conversationId: string, userId: string, limit?: number): Promise<ConversationWithMessages>;
export declare function sendMessage(conversationId: string, userId: string, workspaceId: string, messageContent: string): Promise<{
    userMessage: {
        id: string;
        createdAt: Date;
        role: string;
        content: string;
        conversationId: string;
        sourceItemIds: string[];
    };
    assistantMessage: {
        sources: {
            id: string;
            title: string;
            sourceUrl: string;
        }[];
        id: string;
        createdAt: Date;
        role: string;
        content: string;
        conversationId: string;
        sourceItemIds: string[];
    };
}>;
export declare function deleteConversation(conversationId: string, userId: string): Promise<void>;
//# sourceMappingURL=chat.service.d.ts.map