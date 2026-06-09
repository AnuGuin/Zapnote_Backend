import { Server as SocketIOServer } from 'socket.io';
import { firebaseAuth } from './firebase.js';
import { logger } from '../utils/logger.js';
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
if (!process.env.FRONTEND_URL) {
    logger.warn('FRONTEND_URL not set; using wildcard "*" for Socket.IO CORS origin');
}
export let io;
export function initializeSocketIO(httpServer) {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        },
    });
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication token required'));
            }
            const decodedToken = await firebaseAuth().verifyIdToken(token);
            socket.data.userId = decodedToken.uid;
            logger.info(`Socket authenticated: ${socket.id} for user: ${decodedToken.uid}`);
            next();
        }
        catch (error) {
            logger.error('Socket authentication failed:', error);
            next(new Error('Authentication failed'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        logger.info(`Client connected: ${socket.id}, user: ${userId}`);
        socket.join(`user:${userId}`);
        socket.on('subscribe:workspace', (workspaceId) => {
            socket.join(`workspace:${workspaceId}`);
            logger.info(`User ${userId} subscribed to workspace: ${workspaceId}`);
        });
        socket.on('unsubscribe:workspace', (workspaceId) => {
            socket.leave(`workspace:${workspaceId}`);
            logger.info(`User ${userId} unsubscribed from workspace: ${workspaceId}`);
        });
        socket.on('subscribe:space', (spaceId) => {
            socket.join(`space:${spaceId}`);
            logger.info(`User ${userId} subscribed to space: ${spaceId}`);
        });
        socket.on('unsubscribe:space', (spaceId) => {
            socket.leave(`space:${spaceId}`);
            logger.info(`User ${userId} unsubscribed from space: ${spaceId}`);
        });
        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });
    logger.info('Socket.IO initialized');
    return io;
}
export const socketEmit = {
    toWorkspace: (workspaceId, event, data) => {
        if (io) {
            io.to(`workspace:${workspaceId}`).emit(event, data);
        }
    },
    toSpace: (spaceId, event, data) => {
        if (io) {
            io.to(`space:${spaceId}`).emit(event, data);
        }
    },
    toUser: (userId, event, data) => {
        if (io) {
            io.to(`user:${userId}`).emit(event, data);
        }
    },
    toAll: (event, data) => {
        if (io) {
            io.emit(event, data);
        }
    },
};
//# sourceMappingURL=socket.js.map