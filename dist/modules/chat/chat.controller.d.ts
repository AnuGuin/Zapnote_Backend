import { Request, Response, NextFunction } from 'express';
export declare function createConversation(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getConversations(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getConversation(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=chat.controller.d.ts.map