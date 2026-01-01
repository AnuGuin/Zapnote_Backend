import prisma from '../../config/db.js';
import { redis, CacheKeys } from '../../config/redis.js';
import { socketEmit } from '../../config/socket.js';
import { logger } from '../../utils/logger.js';
import { NotFoundError } from '../../utils/error.js';
import { enqueueContentProcessing } from '../../services/queue/queue.service.js';
function formatTags(tags) {
    return (tags || []).map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
        addedByAI: t.addedByAI,
    }));
}
function maskUntilCompleted(item) {
    if (item?.status === 'COMPLETED')
        return item;
    return {
        ...item,
        summary: null,
        scrapedContent: null,
        metadata: null,
        tags: [],
        embedding: null,
    };
}
export async function createKnowledgeItem(workspaceId, userId, data) {
    try {
        const item = await prisma.knowledgeItem.create({
            data: {
                sourceUrl: data.sourceUrl,
                ...(data.userIntent !== undefined ? { userIntent: data.userIntent } : {}),
                workspaceId,
                createdById: userId,
                status: 'PENDING',
            },
        });
        await redis.del(CacheKeys.workspaceItems(workspaceId));
        await enqueueContentProcessing(item.id);
        socketEmit.toWorkspace(workspaceId, 'knowledge:created', {
            item,
            createdBy: userId,
        });
        logger.info(`Knowledge item created and queued: ${item.id}`);
        return item;
    }
    catch (error) {
        logger.error('Error creating knowledge item:', error);
        throw error;
    }
}
export async function getKnowledgeItems(workspaceId, filters) {
    try {
        const { page, limit, type, status } = filters;
        const skip = (page - 1) * limit;
        const where = {
            workspaceId,
            ...(type && { contentType: type }),
            ...(status && { status }),
        };
        const [items, total] = await Promise.all([
            prisma.knowledgeItem.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    tags: {
                        include: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.knowledgeItem.count({ where }),
        ]);
        const formattedItems = items.map((item) => {
            const formatted = {
                ...item,
                tags: formatTags(item.tags),
            };
            return maskUntilCompleted(formatted);
        });
        return {
            items: formattedItems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    catch (error) {
        logger.error('Error fetching knowledge items:', error);
        throw error;
    }
}
export async function getKnowledgeItemById(itemId, workspaceId) {
    try {
        const item = await prisma.knowledgeItem.findFirst({
            where: {
                id: itemId,
                workspaceId,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                embedding: true,
            },
        });
        if (!item) {
            throw new NotFoundError('Knowledge item not found');
        }
        const formatted = {
            ...item,
            tags: formatTags(item.tags),
        };
        return maskUntilCompleted(formatted);
    }
    catch (error) {
        logger.error('Error fetching knowledge item:', error);
        throw error;
    }
}
export async function updateKnowledgeItem(itemId, workspaceId, data) {
    try {
        const existing = await prisma.knowledgeItem.findFirst({
            where: {
                id: itemId,
                workspaceId,
            },
            select: { id: true },
        });
        if (!existing) {
            throw new NotFoundError('Knowledge item not found');
        }
        const updated = await prisma.knowledgeItem.update({
            where: { id: existing.id },
            data,
        });
        await redis.del(CacheKeys.workspaceItems(workspaceId));
        logger.info(`Knowledge item updated: ${itemId}`);
        return updated;
    }
    catch (error) {
        logger.error('Error updating knowledge item:', error);
        throw error;
    }
}
export async function deleteKnowledgeItem(itemId, workspaceId) {
    try {
        const existing = await prisma.knowledgeItem.findFirst({
            where: {
                id: itemId,
                workspaceId,
            },
            select: { id: true },
        });
        if (!existing) {
            throw new NotFoundError('Knowledge item not found');
        }
        await prisma.knowledgeItem.delete({
            where: { id: existing.id },
        });
        await redis.del(CacheKeys.workspaceItems(workspaceId));
        socketEmit.toWorkspace(workspaceId, 'knowledge:deleted', {
            itemId,
        });
        logger.info(`Knowledge item deleted: ${itemId}`);
    }
    catch (error) {
        logger.error('Error deleting knowledge item:', error);
        throw error;
    }
}
//# sourceMappingURL=knowledge.service.js.map