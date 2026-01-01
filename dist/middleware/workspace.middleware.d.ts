import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
declare global {
    namespace Express {
        interface Request {
            workspaceRole?: Role;
            workspace?: any;
        }
    }
}
export declare function checkWorkspaceAccess(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireRole(...allowedRoles: Role[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function requireWorkspaceOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=workspace.middleware.d.ts.map