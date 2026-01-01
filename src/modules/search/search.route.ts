import express from 'express';
import { authenticateFirebaseToken } from '../../middleware/firebase.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { rateLimit } from '../../middleware/ratelimit.middleware.js';
import { checkWorkspaceAccess } from '../../middleware/workspace.middleware.js';
import * as searchController from './search.controller.js';
import { semanticSearchSchema } from './search.types.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateFirebaseToken);
router.use(checkWorkspaceAccess);

router.post(
  '/semantic',
  rateLimit('search', 100, 3600), 
  validateRequest(semanticSearchSchema),
  searchController.semanticSearchController
);


router.post(
  '/hybrid',
  rateLimit('search', 100, 3600),
  validateRequest(semanticSearchSchema),
  searchController.hybridSearchController
);

export default router;