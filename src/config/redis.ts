import { Redis } from '@upstash/redis';
import crypto from 'crypto';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});


export async function testRedisConnection() {
  try {
    await redis.ping();
    console.log('Redis connected');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
}

export const CACHE_TTL = {
  USER_SESSION: 60 * 60 * 24 * 7,        // 7 days
  USER_PROFILE: 60 * 60,                  // 1 hour
  WORKSPACE_PERMISSIONS: 60 * 15,         // 15 minutes
  WORKSPACE_LIST: 60 * 30,                // 30 minutes
  WORKSPACE_ITEMS: 60 * 30,               // 30 minutes
  SEARCH_RESULTS: 60 * 10,                // 10 minutes
  EMBEDDINGS: 60 * 60 * 24,               // 24 hours
  RATE_LIMIT: 60 * 60,                    // 1 hour
} as const;


export const CacheKeys = {
  userProfile: (userId: string) => `user:${userId}`,
  userWorkspaces: (userId: string) => `user:${userId}:workspaces`,
  
  workspace: (workspaceId: string) => `workspace:${workspaceId}`,
  workspaceMembers: (workspaceId: string) => `workspace:${workspaceId}:members`,
  workspacePermissions: (userId: string, workspaceId: string) => 
    `perm:${userId}:${workspaceId}`,
  workspaceItems: (workspaceId: string) => `workspace:${workspaceId}:items`,
  
  searchResults: (query: string, workspaceId: string) => 
    `search:${workspaceId}:${hashString(query)}`,
  
  embedding: (text: string) => `embed:${hashString(text)}`,
  
  rateLimit: (userId: string, action: string) => `ratelimit:${userId}:${action}`,
};

function hashString(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex').slice(0, 16);
}