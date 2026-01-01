import { Router } from 'express';
import * as workspaceController from './workspace.controller.js';
import * as workspaceMiddleware from './workspace.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { createWorkspaceSchema, updateWorkspaceSchema, addMemberSchema, updateMemberRoleSchema, } from './workspace.types.js';
const router = Router();
// --- TEST AUTH MIDDLEWARE (REMOVE IN PRODUCTION) ---
// This middleware mocks an authenticated user for testing purposes.
// It sets req.userId to a valid user ID from the database.
const mockAuthMiddleware = (req, res, next) => {
    req.userId = 'test-user-123'; // ID of the test user we created
    req.userEmail = 'test@example.com';
    console.log(`[TEST MODE] Bypassing auth, using userId: ${req.userId}`);
    next();
};
// Apply mock auth to all workspace routes
router.use(mockAuthMiddleware);
// ---------------------------------------------------
// Create workspace
router.post('/', validateRequest(createWorkspaceSchema), workspaceController.createWorkspace);
router.get('/:workspaceId', workspaceMiddleware.checkWorkspaceAccess, workspaceController.getWorkspace);
router.patch('/:workspaceId', workspaceMiddleware.checkWorkspaceAccess, workspaceMiddleware.requireRole('OWNER', 'EDITOR'), validateRequest(updateWorkspaceSchema), workspaceController.updateWorkspace);
router.delete('/:workspaceId', workspaceMiddleware.checkWorkspaceAccess, workspaceMiddleware.requireWorkspaceOwner, workspaceController.deleteWorkspace);
router.get('/:workspaceId/members', workspaceMiddleware.checkWorkspaceAccess, workspaceController.getMembers);
router.post('/:workspaceId/members', workspaceMiddleware.checkWorkspaceAccess, workspaceMiddleware.requireRole('OWNER', 'EDITOR'), validateRequest(addMemberSchema), workspaceController.addMember);
router.patch('/:workspaceId/members/:memberId', workspaceMiddleware.checkWorkspaceAccess, workspaceMiddleware.requireWorkspaceOwner, validateRequest(updateMemberRoleSchema), workspaceController.updateMemberRole);
router.delete('/:workspaceId/members/:memberId', workspaceMiddleware.checkWorkspaceAccess, workspaceMiddleware.requireWorkspaceOwner, workspaceController.removeMember);
router.post('/:workspaceId/leave', workspaceMiddleware.checkWorkspaceAccess, workspaceController.leaveWorkspace);
export default router;
//# sourceMappingURL=workspace.route.js.map