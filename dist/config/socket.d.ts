import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
export declare let io: SocketIOServer;
export declare function initializeSocketIO(httpServer: HTTPServer): SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const socketEmit: {
    toWorkspace: (workspaceId: string, event: string, data: any) => void;
    toSpace: (spaceId: string, event: string, data: any) => void;
    toUser: (userId: string, event: string, data: any) => void;
    toAll: (event: string, data: any) => void;
};
//# sourceMappingURL=socket.d.ts.map