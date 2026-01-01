import { z } from 'zod';

export const createSpaceSchema = z.object({
  params: z.object({
    workspaceId: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(100),
  }),
});

export const createElementSchema = z.object({
  params: z.object({
    workspaceId: z.string().uuid(),
    spaceId: z.string().uuid(),
  }),
  body: z.object({
    type: z.string().min(1),
    content: z.any(),
  }),
});

export const updateElementSchema = z.object({
  params: z.object({
    workspaceId: z.string().uuid(),
    spaceId: z.string().uuid(),
    elementId: z.string().uuid(),
  }),
  body: z.object({
    content: z.any(),
  }),
});