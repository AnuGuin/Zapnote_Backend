export declare function createSpace(workspaceId: string, name: string): Promise<any>;
export declare function getWorkspaceSpaces(workspaceId: string): Promise<any>;
export declare function getSpaceWithElements(spaceId: string, workspaceId: string): Promise<any>;
export declare function createElement(spaceId: string, type: string, content: any): Promise<any>;
export declare function updateElement(elementId: string, spaceId: string, content: any): Promise<any>;
export declare function moveElement(elementId: string, spaceId: string, content: any): Promise<any>;
export declare function deleteElement(elementId: string, spaceId: string): Promise<void>;
export declare function deleteSpace(spaceId: string, workspaceId: string): Promise<void>;
//# sourceMappingURL=whiteboard.service.d.ts.map