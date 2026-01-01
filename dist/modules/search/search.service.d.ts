import { SearchResponse } from './search.types.js';
export declare function semanticSearch(query: string, workspaceId: string, limit?: number, filters?: {
    contentType?: string;
    tags?: string[];
}): Promise<SearchResponse>;
export declare function performHybridSearch(query: string, workspaceId: string, limit?: number): Promise<SearchResponse>;
//# sourceMappingURL=search.service.d.ts.map