import { firebaseAuth } from '../config/firebase.js';
import prisma from '../config/db.js';
import { redis } from '../config/redis.js';
export async function authenticateFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided',
            });
        }
        const idToken = authHeader.split('Bearer ')[1] ?? '';
        if (!idToken) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided',
            });
        }
        const cacheKey = `firebase_token:${idToken.slice(-20)}`;
        const cachedUserId = await redis.get(cacheKey);
        if (cachedUserId) {
            req.userId = cachedUserId;
            return next();
        }
        const decodedToken = await firebaseAuth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email;
        await redis.set(cacheKey, firebaseUid, { ex: 3600 });
        let user = await prisma.user.findUnique({
            where: { id: firebaseUid },
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: firebaseUid,
                    email: email || '',
                    username: decodedToken.name || email?.split('@')[0] || `user_${firebaseUid.slice(0, 8)}`,
                },
            });
            console.log(`New user created: ${user.id}`);
        }
        req.userId = firebaseUid;
        if (email)
            req.userEmail = email;
        next();
    }
    catch (error) {
        console.error('Firebase Auth Error:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                error: 'TokenExpired',
                message: 'Token has expired. Please sign in again.',
            });
        }
        if (error.code === 'auth/argument-error') {
            return res.status(401).json({
                error: 'InvalidToken',
                message: 'Invalid token format',
            });
        }
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication failed',
        });
    }
}
export function requireCustomClaim(claimName, claimValue) {
    return async (req, res, next) => {
        try {
            const user = await firebaseAuth().getUser(req.userId);
            const customClaims = user.customClaims || {};
            if (customClaims[claimName] !== claimValue) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: `Requires ${claimName}: ${claimValue}`,
                });
            }
            next();
        }
        catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    };
}
//# sourceMappingURL=firebase.middleware.js.map