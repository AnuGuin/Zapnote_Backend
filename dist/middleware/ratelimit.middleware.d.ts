import type { Request, Response, NextFunction } from "express";
export declare function rateLimit(action: string, limit: number, windowSeconds?: number): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=ratelimit.middleware.d.ts.map