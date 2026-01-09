import prisma from '../../config/db.js';
import { logger } from '../../utils/logger.js';
import { NotFoundError } from '../../utils/error.js';


const db = prisma as unknown as any;


export async function createSpace(workspaceId: string, name: string) {
  try {
    const space = await db.space.create({
      data: {
        name,
        workspaceId,
      },
    });

    logger.info(`Space created: ${space.id}`);
    return space;
  } catch (error) {
    logger.error('Error creating space:', error);
    throw error;
  }
}


export async function getWorkspaceSpaces(workspaceId: string) {
  try {
    const spaces = await db.space.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { elements: true },
        },
      },
    });

    return spaces;
  } catch (error) {
    logger.error('Error fetching spaces:', error);
    throw error;
  }
}


export async function getSpaceWithElements(spaceId: string, workspaceId: string) {
  try {
    const space = await db.space.findFirst({
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
  } catch (error) {
    logger.error('Error fetching space:', error);
    throw error;
  }
}


export async function createElement(
  spaceId: string,
  type: string,
  content: any
) {
  try {
    const element = await db.spaceElement.create({
      data: {
        spaceId,
        type,
        content,
      },
    });

    await db.space.update({
      where: { id: spaceId },
      data: { updatedAt: new Date() },
    });

    logger.info(`Element created in space ${spaceId}`);
    return element;
  } catch (error) {
    logger.error('Error creating element:', error);
    throw error;
  }
}


export async function updateElement(
  elementId: string,
  spaceId: string,
  content: any
) {
  try {
    const element = await db.spaceElement.update({
      where: {
        id: elementId,
        spaceId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    await db.space.update({
      where: { id: spaceId },
      data: { updatedAt: new Date() },
    });

    return element;
  } catch (error) {
    logger.error('Error updating element:', error);
    throw error;
  }
}


export async function moveElement(
  elementId: string,
  spaceId: string,
  content: any
) {
  try {
    const existingElement = await db.spaceElement.findFirst({
      where: {
        id: elementId,
        spaceId,
      },
    });

    if (!existingElement) {
      throw new NotFoundError('Element not found in this space');
    }

    const element = await db.spaceElement.update({
      where: {
        id: elementId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    await db.space.update({
      where: { id: spaceId },
      data: { updatedAt: new Date() },
    });

    logger.info(`Element moved in space ${spaceId}: ${elementId}`);
    return element;
  } catch (error) {
    logger.error('Error moving element:', error);
    throw error;
  }
}


export async function deleteElement(elementId: string, spaceId: string) {
  try {
    await db.spaceElement.delete({
      where: {
        id: elementId,
        spaceId,
      },
    });

    logger.info(`Element deleted: ${elementId}`);
  } catch (error) {
    logger.error('Error deleting element:', error);
    throw error;
  }
}


export async function deleteSpace(spaceId: string, workspaceId: string) {
  try {
    await db.space.delete({
      where: {
        id: spaceId,
        workspaceId,
      },
    });

    logger.info(`Space deleted: ${spaceId}`);
  } catch (error) {
    logger.error('Error deleting space:', error);
    throw error;
  }
}