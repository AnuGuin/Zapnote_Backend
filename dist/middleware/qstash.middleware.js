import { Receiver } from '@upstash/qstash';
import { logger } from '../utils/logger.js';
export const verifyQStashSignature = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development' && !process.env.QSTASH_CURRENT_SIGNING_KEY) {
        logger.warn('Skipping QStash verification in development (no keys)');
        return next();
    }
    const signature = req.headers['upstash-signature'];
    if (!signature) {
        logger.warn('Missing QStash signature');
        return res.status(401).json({ error: 'Missing signature' });
    }
    const receiver = new Receiver({
        currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || '',
    });
    try {
        const body = req.rawBody || JSON.stringify(req.body);
        const isValid = await receiver.verify({
            signature,
            body,
        });
        if (!isValid) {
            logger.warn('Invalid QStash signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        next();
    }
    catch (error) {
        logger.error('QStash verification error:', error);
        return res.status(500).json({ error: 'Verification failed' });
    }
};
//# sourceMappingURL=qstash.middleware.js.map