import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId: string;
            userEmail?: string;
        }
    }
}
export declare function authenticateFirebaseToken(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function requireCustomClaim(claimName: string, claimValue: any): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=firebase.middleware.d.ts.map