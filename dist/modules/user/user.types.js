import { z } from "zod";
export const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50).optional(),
        displayName: z.string().min(1).max(100).optional(),
    })
});
//# sourceMappingURL=user.types.js.map