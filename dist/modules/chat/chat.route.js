import express from 'express';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import { checkWorkspaceAccess } from '../../middleware/workspace.middleware.js';
import * as chatController from './chat.controller.js';
import { createConversationSchema, sendMessageSchema, getMessagesSchema, } from './chat.types.js';
const router = express.Router({ mergeParams: true });
router.use(authenticateFirebaseToken);
router.use(checkWorkspaceAccess);
router.post('/', rateLimit('create-conversation', 50), validateRequest(createConversationSchema), chatController.createConversation);
router.get('/', chatController.getConversations);
router.get('/:conversationId', validateRequest(getMessagesSchema), chatController.getConversation);
router.post('/:conversationId/messages', rateLimit('send-message', 100), validateRequest(sendMessageSchema), chatController.sendMessage);
router.delete('/:conversationId', chatController.deleteConversation);
export default router;
//# sourceMappingURL=chat.route.js.map