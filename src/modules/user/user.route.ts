import express from 'express';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import * as userController from './user.controller.js';
import { updateProfileSchema } from './user.types.js';

const router = express.Router();


router.use(authenticateFirebaseToken);

router.get('/me', userController.getMe);

router.patch(
  '/me',
  rateLimit('update-profile', 10, 3600), 
  validateRequest(updateProfileSchema),
  userController.updateProfile
);

router.get('/me/stats', userController.getStats);

router.get('/me/workspaces', userController.getWorkspaces);


router.delete(
  '/me',
  rateLimit('delete-account', 1, 3600), 
  userController.deleteAccount
);

export default router;