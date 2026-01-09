import express from 'express';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import { checkWorkspaceAccess, requireRole } from '../../middleware/workspace.middleware.js';
import * as whiteboardController from './whiteboard.controller.js';
import {
  createSpaceSchema,
  createElementSchema,
  updateElementSchema,
  moveElementSchema,
} from './whiteboard.types.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateFirebaseToken);
router.use(checkWorkspaceAccess);

router.post(
  '/',
  requireRole('OWNER', 'EDITOR'),
  validateRequest(createSpaceSchema),
  whiteboardController.createSpace
);

router.get('/', whiteboardController.getSpaces);

router.get('/:spaceId', whiteboardController.getSpace);

router.post(
  '/:spaceId/elements',
  requireRole('OWNER', 'EDITOR'),
  rateLimit('create-element', 500), 
  validateRequest(createElementSchema),
  whiteboardController.createElement
);

router.patch(
  '/:spaceId/elements/:elementId',
  requireRole('OWNER', 'EDITOR'),
  validateRequest(updateElementSchema),
  whiteboardController.updateElement
);

router.put(
  '/:spaceId/elements/:elementId/move',
  requireRole('OWNER', 'EDITOR'),
  rateLimit('move-element', 1000),
  validateRequest(moveElementSchema),
  whiteboardController.moveElement
);

router.delete(
  '/:spaceId/elements/:elementId',
  requireRole('OWNER', 'EDITOR'),
  whiteboardController.deleteElement
);

router.delete(
  '/:spaceId',
  requireRole('OWNER'),
  whiteboardController.deleteSpace
);

export default router;