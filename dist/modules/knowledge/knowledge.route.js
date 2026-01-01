import express from 'express';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import { checkWorkspaceAccess, requireRole } from '../../middleware/workspace.middleware.js';
import * as knowledgeController from './knowledge.controller.js';
import { createKnowledgeItemSchema, updateKnowledgeItemSchema, getKnowledgeItemsSchema, knowledgeItemIdSchema, } from './knowledge.types.js';
const router = express.Router({ mergeParams: true });
router.use(authenticateFirebaseToken);
router.use('/:workspaceId', checkWorkspaceAccess);
router.post('/:workspaceId', requireRole('OWNER', 'EDITOR'), rateLimit('create-knowledge-item', 50, 3600), validateRequest(createKnowledgeItemSchema), knowledgeController.createItem);
router.get('/:workspaceId', validateRequest(getKnowledgeItemsSchema), knowledgeController.getItems);
router.get('/:workspaceId/:itemId', validateRequest(knowledgeItemIdSchema), knowledgeController.getItem);
router.patch('/:workspaceId/:itemId', requireRole('OWNER', 'EDITOR'), validateRequest(updateKnowledgeItemSchema), knowledgeController.updateItem);
router.delete('/:workspaceId/:itemId', requireRole('OWNER', 'EDITOR'), validateRequest(knowledgeItemIdSchema), knowledgeController.deleteItem);
export default router;
//# sourceMappingURL=knowledge.route.js.map