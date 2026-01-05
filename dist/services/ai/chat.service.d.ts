export declare function generateChatResponse(userQuery: string, retrievedContext: Array<{
    id: string;
    title: string;
    content: string;
    sourceUrl: string;
}>, conversationHistory?: Array<{
    role: string;
    content: string;
}>): Promise<{
    response: string;
    sourceIds: string[];
}>;
//# sourceMappingURL=chat.service.d.ts.map