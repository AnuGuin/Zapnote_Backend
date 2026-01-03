import { UserProfile, UserStats } from './user.types.js';
export declare function getUserById(userId: string): Promise<UserProfile | null>;
export declare function updateUserProfile(userId: string, data: {
    username?: string;
    displayName?: string;
}): Promise<UserProfile>;
export declare function getUserStats(userId: string): Promise<UserStats>;
export declare function getUserWorkspaces(userId: string): Promise<unknown>;
export declare function deleteUser(userId: string): Promise<void>;
//# sourceMappingURL=user.service.d.ts.map