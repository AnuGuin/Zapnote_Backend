import express from 'express';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import { checkWorkspaceAccess, requireRole } from '../workspace/workspace.middleware.js';
import * as knowledgeController from './knowledge.controller.js';
import { createKnowledgeItemSchema, updateKnowledgeItemSchema, getKnowledgeItemsSchema, knowledgeItemIdSchema, } from './knowledge.types.js';
const router = express.Router({ mergeParams: true });
// --- TEST AUTH MIDDLEWARE (REMOVE IN PRODUCTION) ---
// This middleware mocks an authenticated user for testing purposes.
// It sets req.userId to a valid user ID from the database.
const mockAuthMiddleware = (req, res, next) => {
    req.userId = '11111111-1111-4111-8111-111111111111'; // ID of the test user we created
    req.userEmail = 'test@example.com';
    console.log(`[TEST MODE] Bypassing auth, using userId: ${req.userId}`);
    next();
};
// Apply mock auth to all knowledge routes
router.use(mockAuthMiddleware);
// ---------------------------------------------------
//router.use(authenticateFirebaseToken);
router.use('/:workspaceId', checkWorkspaceAccess);
router.post('/:workspaceId', requireRole('OWNER', 'EDITOR'), rateLimit('create-knowledge-item', 50, 3600), validateRequest(createKnowledgeItemSchema), knowledgeController.createItem);
router.get('/:workspaceId', validateRequest(getKnowledgeItemsSchema), knowledgeController.getItems);
router.get('/:workspaceId/:itemId', validateRequest(knowledgeItemIdSchema), knowledgeController.getItem);
router.patch('/:workspaceId/:itemId', requireRole('OWNER', 'EDITOR'), validateRequest(updateKnowledgeItemSchema), knowledgeController.updateItem);
router.delete('/:workspaceId/:itemId', requireRole('OWNER', 'EDITOR'), validateRequest(knowledgeItemIdSchema), knowledgeController.deleteItem);
export default router;
//# sourceMappingURL=knowledge.route.js.map