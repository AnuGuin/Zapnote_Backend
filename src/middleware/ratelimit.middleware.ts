import type { Request, Response, NextFunction } from "express";
import { redis, CacheKeys } from "../config/redis.js";
import { RateLimitError } from "../utils/error.js";

export function rateLimit(action: string, limit: number, windowSeconds: number = 3600){
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const userId = req.userId;
            const key = CacheKeys.rateLimit(userId, action);
            
            const curr = await redis.incr(key);

            if(curr === 1){
                await redis.expire(key, windowSeconds);
            }
            if (curr > limit) {
                throw new RateLimitError(
            `Rate limit exceeded. Max ${limit} requests per ${windowSeconds}s`
             );
        }
      
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - curr));
      
        next();

        } catch (error) {
            next(error)
        }
    };
} 