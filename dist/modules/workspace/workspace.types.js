import { z } from 'zod';
export const createWorkspaceSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
    }),
});
export const updateWorkspaceSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
    }),
    params: z.object({
        workspaceId: z.string().uuid(),
    }),
});
export const addMemberSchema = z.object({
    body: z.object({
        email: z.string().email(),
        role: z.enum(['OWNER', 'EDITOR', 'VIEWER']),
    }),
    params: z.object({
        workspaceId: z.string().uuid(),
    }),
});
export const updateMemberRoleSchema = z.object({
    body: z.object({
        role: z.enum(['OWNER', 'EDITOR', 'VIEWER']),
    }),
    params: z.object({
        workspaceId: z.string().uuid(),
        memberId: z.string().uuid(),
    }),
});
export const workspaceIdSchema = z.object({
    params: z.object({
        workspaceId: z.string().uuid(),
    }),
});
//# sourceMappingURL=workspace.types.js.map