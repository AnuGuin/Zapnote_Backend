import prisma from '../../config/db.js';
import { logger } from '../../utils/logger.js';
import { NotFoundError } from '../../utils/error.js';
/**
 * Create new space (whiteboard)
 */
export async function createSpace(workspaceId, name) {
    try {
        const space = await prisma.space.create({
            data: {
                name,
                workspaceId,
            },
        });
        logger.info(`Space created: ${space.id}`);
        return space;
    }
    catch (error) {
        logger.error('Error creating space:', error);
        throw error;
    }
}
/**
 * Get all spaces in workspace
 */
export async function getWorkspaceSpaces(workspaceId) {
    try {
        const spaces = await prisma.space.findMany({
            where: { workspaceId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { elements: true },
                },
            },
        });
        return spaces;
    }
    catch (error) {
        logger.error('Error fetching spaces:', error);
        throw error;
    }
}
/**
 * Get space with all elements
 */
export async function getSpaceWithElements(spaceId, workspaceId) {
    try {
        const space = await prisma.space.findFirst({
            where: {
                id: spaceId,
                workspaceId,
            },
            include: {
                elements: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!space) {
            throw new NotFoundError('Space not found');
        }
        return space;
    }
    catch (error) {
        logger.error('Error fetching space:', error);
        throw error;
    }
}
/**
 * Create element in space
 */
export async function createElement(spaceId, type, content) {
    try {
        const element = await prisma.spaceElement.create({
            data: {
                spaceId,
                type,
                content,
            },
        });
        // Update space timestamp
        await prisma.space.update({
            where: { id: spaceId },
            data: { updatedAt: new Date() },
        });
        logger.info(`Element created in space ${spaceId}`);
        return element;
    }
    catch (error) {
        logger.error('Error creating element:', error);
        throw error;
    }
}
/**
 * Update element
 */
export async function updateElement(elementId, spaceId, content) {
    try {
        const element = await prisma.spaceElement.update({
            where: {
                id: elementId,
                spaceId,
            },
            data: {
                content,
                updatedAt: new Date(),
            },
        });
        // Update space timestamp
        await prisma.space.update({
            where: { id: spaceId },
            data: { updatedAt: new Date() },
        });
        return element;
    }
    catch (error) {
        logger.error('Error updating element:', error);
        throw error;
    }
}
/**
 * Delete element
 */
export async function deleteElement(elementId, spaceId) {
    try {
        await prisma.spaceElement.delete({
            where: {
                id: elementId,
                spaceId,
            },
        });
        logger.info(`Element deleted: ${elementId}`);
    }
    catch (error) {
        logger.error('Error deleting element:', error);
        throw error;
    }
}
/**
 * Delete space
 */
export async function deleteSpace(spaceId, workspaceId) {
    try {
        await prisma.space.delete({
            where: {
                id: spaceId,
                workspaceId,
            },
        });
        logger.info(`Space deleted: ${spaceId}`);
    }
    catch (error) {
        logger.error('Error deleting space:', error);
        throw error;
    }
}
//# sourceMappingURL=whiteboard.service.js.map