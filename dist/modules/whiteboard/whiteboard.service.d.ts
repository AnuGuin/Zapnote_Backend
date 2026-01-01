/**
 * Create new space (whiteboard)
 */
export declare function createSpace(workspaceId: string, name: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    workspaceId: string;
}>;
/**
 * Get all spaces in workspace
 */
export declare function getWorkspaceSpaces(workspaceId: string): Promise<({
    _count: {
        elements: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    workspaceId: string;
})[]>;
/**
 * Get space with all elements
 */
export declare function getSpaceWithElements(spaceId: string, workspaceId: string): Promise<{
    elements: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        spaceId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    workspaceId: string;
}>;
/**
 * Create element in space
 */
export declare function createElement(spaceId: string, type: string, content: any): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    content: import("@prisma/client/runtime/client").JsonValue;
    spaceId: string;
}>;
/**
 * Update element
 */
export declare function updateElement(elementId: string, spaceId: string, content: any): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    content: import("@prisma/client/runtime/client").JsonValue;
    spaceId: string;
}>;
/**
 * Delete element
 */
export declare function deleteElement(elementId: string, spaceId: string): Promise<void>;
/**
 * Delete space
 */
export declare function deleteSpace(spaceId: string, workspaceId: string): Promise<void>;
//# sourceMappingURL=whiteboard.service.d.ts.map