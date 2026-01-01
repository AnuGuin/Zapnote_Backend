import { z } from 'zod';
import { Role } from '@prisma/client';

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