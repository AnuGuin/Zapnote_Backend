import { Role } from '@prisma/client';
import { WorkspaceMemberWithUser } from './workspace.types.js';
export declare function createWorkspace(userId: string, data: {
    name: string;
    description?: string;
}): Promise<{
    role: import("@prisma/client").$Enums.Role;
    members: {
        role: import("@prisma/client").$Enums.Role;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    ownerId: string;
    description: string | null;
}>;
export declare function getWorkspaceById(workspaceId: string, userId: string): Promise<{
    role: import("@prisma/client").$Enums.Role;
    memberCount: number;
    itemCount: number;
    _count: {
        members: number;
        items: number;
    };
    members: {
        role: import("@prisma/client").$Enums.Role;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    ownerId: string;
    description: string | null;
}>;
export declare function updateWorkspace(workspaceId: string, data: {
    name?: string;
    description?: string;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    ownerId: string;
    description: string | null;
}>;
export declare function deleteWorkspace(workspaceId: string): Promise<void>;
export declare function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberWithUser[]>;
export declare function addWorkspaceMember(workspaceId: string, email: string, role: Role): Promise<{
    user: {
        id: string;
        email: string;
        username: string;
        displayName: string | null;
        photoURL: string | null;
    };
} & {
    id: string;
    role: import("@prisma/client").$Enums.Role;
    userId: string;
    workspaceId: string;
    joinedAt: Date;
}>;
export declare function updateMemberRole(workspaceId: string, memberId: string, newRole: Role): Promise<{
    user: {
        id: string;
        email: string;
        username: string;
        displayName: string | null;
        photoURL: string | null;
    };
} & {
    id: string;
    role: import("@prisma/client").$Enums.Role;
    userId: string;
    workspaceId: string;
    joinedAt: Date;
}>;
export declare function removeMember(workspaceId: string, memberId: string): Promise<void>;
export declare function leaveWorkspace(workspaceId: string, userId: string): Promise<void>;
//# sourceMappingURL=workspace.service.d.ts.map