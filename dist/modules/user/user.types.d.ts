import { z } from "zod";
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        displayName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
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
//# sourceMappingURL=user.types.d.ts.map