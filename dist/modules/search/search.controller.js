import * as searchService from './search.service.js';
import { successResponse } from '../../utils/response.js';
export async function semanticSearchController(req, res, next) {
    try {
        const { workspaceId } = req.params;
        const { query, limit, filters } = req.body;
        if (!workspaceId) {
            const err = new Error('workspaceId is required');
            err.status = 400;
            throw err;
        }
        if (typeof query !== 'string' || query.trim().length === 0) {
            const err = new Error('query is required');
            err.status = 400;
            throw err;
        }
        const results = await searchService.semanticSearch(query, workspaceId, limit, filters);
        successResponse(res, results, 'Search completed successfully');
    }
    catch (error) {
        next(error);
    }
}
export async function hybridSearchController(req, res, next) {
    try {
        const { workspaceId } = req.params;
        const { query, limit } = req.body;
        if (!workspaceId) {
            const err = new Error('workspaceId is required');
            err.status = 400;
            throw err;
        }
        if (typeof query !== 'string' || query.trim().length === 0) {
            const err = new Error('query is required');
            err.status = 400;
            throw err;
        }
        const results = await searchService.performHybridSearch(query, workspaceId, limit);
        successResponse(res, results, 'Hybrid search completed successfully');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=search.controller.js.map