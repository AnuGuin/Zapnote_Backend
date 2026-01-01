import express from 'express';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import { checkWorkspaceAccess, requireRole } from '../workspace/workspace.middleware.js';
import * as whiteboardController from './whiteboard.controller.js';
import { createSpaceSchema, createElementSchema, updateElementSchema, } from './whiteboard.types.js';
const router = express.Router({ mergeParams: true });
// All routes require authentication and workspace access
router.use(authenticateFirebaseToken);
router.use(checkWorkspaceAccess);
// Create space (Editor/Owner only)
router.post('/', requireRole('OWNER', 'EDITOR'), validateRequest(createSpaceSchema), whiteboardController.createSpace);
// Get spaces
router.get('/', whiteboardController.getSpaces);
// Get space with elements
router.get('/:spaceId', whiteboardController.getSpace);
// Create element (Editor/Owner only)
router.post('/:spaceId/elements', requireRole('OWNER', 'EDITOR'), rateLimit('create-element', 500), // 500 per hour
validateRequest(createElementSchema), whiteboardController.createElement);
// Update element (Editor/Owner only)
router.patch('/:spaceId/elements/:elementId', requireRole('OWNER', 'EDITOR'), validateRequest(updateElementSchema), whiteboardController.updateElement);
// Delete element (Editor/Owner only)
router.delete('/:spaceId/elements/:elementId', requireRole('OWNER', 'EDITOR'), whiteboardController.deleteElement);
// Delete space (Owner only)
router.delete('/:spaceId', requireRole('OWNER'), whiteboardController.deleteSpace);
export default router;
//# sourceMappingURL=whiteboard.routes.js.map