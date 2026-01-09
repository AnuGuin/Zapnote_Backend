import { z } from 'zod';
export declare const createSpaceSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createElementSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        spaceId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        type: z.ZodString;
        content: z.ZodAny;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateElementSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        spaceId: z.ZodString;
        elementId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodAny;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const moveElementSchema: z.ZodObject<{
    params: z.ZodObject<{
        workspaceId: z.ZodString;
        spaceId: z.ZodString;
        elementId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodAny;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=whiteboard.types.d.ts.map