import * as whiteboardService from './whiteboard.service.js';
import { successResponse } from '../../utils/response.js';
import { socketEmit } from '../../config/socket.js';
/**
 * Create space
 * POST /api/v1/workspaces/:workspaceId/spaces
 */
export async function createSpace(req, res, next) {
    try {
        const { workspaceId } = req.params;
        const { name } = req.body;
        const space = await whiteboardService.createSpace(workspaceId, name);
        // Notify workspace members
        socketEmit.toWorkspace(workspaceId, 'space:created', space);
        successResponse(res, space, 'Space created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get spaces
 * GET /api/v1/workspaces/:workspaceId/spaces
 */
export async function getSpaces(req, res, next) {
    try {
        const { workspaceId } = req.params;
        const spaces = await whiteboardService.getWorkspaceSpaces(workspaceId);
        successResponse(res, spaces, 'Spaces fetched successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get space with elements
 * GET /api/v1/workspaces/:workspaceId/spaces/:spaceId
 */
export async function getSpace(req, res, next) {
    try {
        const { workspaceId, spaceId } = req.params;
        const space = await whiteboardService.getSpaceWithElements(spaceId, workspaceId);
        successResponse(res, space, 'Space fetched successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create element
 * POST /api/v1/workspaces/:workspaceId/spaces/:spaceId/elements
 */
export async function createElement(req, res, next) {
    try {
        const { workspaceId, spaceId } = req.params;
        const { type, content } = req.body;
        const element = await whiteboardService.createElement(spaceId, type, content);
        // Real-time update
        socketEmit.toWorkspace(workspaceId, 'element:created', {
            spaceId,
            element,
        });
        successResponse(res, element, 'Element created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update element
 * PATCH /api/v1/workspaces/:workspaceId/spaces/:spaceId/elements/:elementId
 */
export async function updateElement(req, res, next) {
    try {
        const { workspaceId, spaceId, elementId } = req.params;
        const { content } = req.body;
        const element = await whiteboardService.updateElement(elementId, spaceId, content);
        // Real-time update
        socketEmit.toWorkspace(workspaceId, 'element:updated', {
            spaceId,
            element,
        });
        successResponse(res, element, 'Element updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete element
 * DELETE /api/v1/workspaces/:workspaceId/spaces/:spaceId/elements/:elementId
 */
export async function deleteElement(req, res, next) {
    try {
        const { workspaceId, spaceId, elementId } = req.params;
        await whiteboardService.deleteElement(elementId, spaceId);
        // Real-time update
        socketEmit.toWorkspace(workspaceId, 'element:deleted', {
            spaceId,
            elementId,
        });
        successResponse(res, null, 'Element deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete space
 * DELETE /api/v1/workspaces/:workspaceId/spaces/:spaceId
 */
export async function deleteSpace(req, res, next) {
    try {
        const { workspaceId, spaceId } = req.params;
        await whiteboardService.deleteSpace(spaceId, workspaceId);
        // Real-time update
        socketEmit.toWorkspace(workspaceId, 'space:deleted', { spaceId });
        successResponse(res, null, 'Space deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=whiteboard.controller.js.map