import { Redis } from '@upstash/redis';
export declare const redis: Redis;
export declare function testRedisConnection(): Promise<void>;
export declare const CACHE_TTL: {
    readonly USER_SESSION: number;
    readonly USER_PROFILE: number;
    readonly WORKSPACE_PERMISSIONS: number;
    readonly WORKSPACE_LIST: number;
    readonly WORKSPACE_ITEMS: number;
    readonly SEARCH_RESULTS: number;
    readonly EMBEDDINGS: number;
    readonly RATE_LIMIT: number;
};
export declare const CacheKeys: {
    userProfile: (userId: string) => string;
    userWorkspaces: (userId: string) => string;
    workspace: (workspaceId: string) => string;
    workspaceMembers: (workspaceId: string) => string;
    workspacePermissions: (userId: string, workspaceId: string) => string;
    workspaceItems: (workspaceId: string) => string;
    searchResults: (query: string, workspaceId: string) => string;
    embedding: (text: string) => string;
    rateLimit: (userId: string, action: string) => string;
};
//# sourceMappingURL=redis.d.ts.map