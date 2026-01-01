import { z } from 'zod';
import { Role } from '@prisma/client';
export declare const createWorkspaceSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateWorkspaceSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const addMemberSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        role: z.ZodEnum<{
            OWNER: "OWNER";
            EDITOR: "EDITOR";
            VIEWER: "VIEWER";
        }>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateMemberRoleSchema: z.ZodObject<{
    body: z.ZodObject<{
        role: z.ZodEnum<{
            OWNER: "OWNER";
            EDITOR: "EDITOR";
            VIEWER: "VIEWER";
        }>;
    }, z.core.$strip>;
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        memberId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const workspaceIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export interface WorkspaceWithRole {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    memberCount?: number;
    itemCount?: number;
}
export interface WorkspaceMemberWithUser {
    id: string;
    role: Role;
    joinedAt: Date;
    user: {
        id: string;
        email: string;
        username: string;
        displayName: string | null;
        photoURL: string | null;
    };
}
//# sourceMappingURL=workspace.types.d.ts.map