import type { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare function validateRequest(schema: ZodObject): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validation.middleware.d.ts.map