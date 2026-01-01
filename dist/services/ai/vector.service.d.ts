export declare function vectorSearch(embedding: number[], workspaceId: string, limit?: number, filters?: {
    contentType?: string;
    tags?: string[];
}): Promise<any[]>;
export declare function hybridSearch(embedding: number[], keywords: string, workspaceId: string, limit?: number): Promise<any[]>;
//# sourceMappingURL=vector.service.d.ts.map