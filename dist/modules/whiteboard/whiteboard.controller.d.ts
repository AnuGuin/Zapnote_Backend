import { Request, Response, NextFunction } from 'express';
/**
 * Create space
 * POST /api/v1/workspaces/:workspaceId/spaces
 */
export declare function createSpace(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get spaces
 * GET /api/v1/workspaces/:workspaceId/spaces
 */
export declare function getSpaces(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get space with elements
 * GET /api/v1/workspaces/:workspaceId/spaces/:spaceId
 */
export declare function getSpace(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Create element
 * POST /api/v1/workspaces/:workspaceId/spaces/:spaceId/elements
 */
export declare function createElement(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Update element
 * PATCH /api/v1/workspaces/:workspaceId/spaces/:spaceId/elements/:elementId
 */
export declare function updateElement(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Delete element
 * DELETE /api/v1/workspaces/:workspaceId/spaces/:spaceId/elements/:elementId
 */
export declare function deleteElement(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Delete space
 * DELETE /api/v1/workspaces/:workspaceId/spaces/:spaceId
 */
export declare function deleteSpace(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=whiteboard.controller.d.ts.map