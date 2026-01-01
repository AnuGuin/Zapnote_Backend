import {z} from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50).optional(),
        displayName: z.string().min(1).max(100).optional(),
    })
})

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface UserStats {
  totalWorkspaces: number;
  ownedWorkspaces: number;
  totalKnowledgeItems: number;
  totalConversations: number;
}