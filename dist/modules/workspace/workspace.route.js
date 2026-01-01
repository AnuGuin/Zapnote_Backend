import { Router } from 'express';
import * as workspaceController from './workspace.controller.js';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import * as workspaceMiddleware from '../../middleware/workspace.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { createWorkspaceSchema, updateWorkspaceSchema, addMemberSchema, updateMemberRoleSchema, } from './workspace.types.js';
const router = Router();
router.use(authenticateFirebaseToken);
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