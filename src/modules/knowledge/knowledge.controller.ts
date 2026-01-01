import { Request, Response, NextFunction } from 'express';
import * as knowledgeService from './knowledge.service.js';
import { successResponse, paginatedResponse } from '../../utils/response.js';
import { ValidationError } from '../../utils/error.js';

function requireParam(value: string | undefined, name: string): string {
  if (!value) {
    throw new ValidationError(`${name} is required`);
  }
  return value;
}


export async function createItem(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = requireParam(req.params.workspaceId, 'workspaceId');
    const { sourceUrl, userIntent } = req.body;

    const item = await knowledgeService.createKnowledgeItem(
      workspaceId,
      req.userId,
      { sourceUrl, userIntent }
    );

    successResponse(res, item, 'Knowledge item created, processing...', 201);
  } catch (error) {
    next(error);
  }
}


export async function getItems(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = requireParam(req.params.workspaceId, 'workspaceId');
    const { page, limit, type, status } = req.query;

    const result = await knowledgeService.getKnowledgeItems(workspaceId, {
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      type: type as any,
      status: status as any,
    });

    paginatedResponse(
      res,
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  } catch (error) {
    next(error);
  }
}


export async function getItem(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = requireParam(req.params.workspaceId, 'workspaceId');
    const itemId = requireParam(req.params.itemId, 'itemId');
    const item = await knowledgeService.getKnowledgeItemById(itemId, workspaceId);

    successResponse(res, item, 'Knowledge item fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = requireParam(req.params.workspaceId, 'workspaceId');
    const itemId = requireParam(req.params.itemId, 'itemId');
    const { userIntent } = req.body;

    const updated = await knowledgeService.updateKnowledgeItem(itemId, workspaceId, {
      userIntent,
    });

    successResponse(res, updated, 'Knowledge item updated successfully');
  } catch (error) {
    next(error);
  }
}


export async function deleteItem(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = requireParam(req.params.workspaceId, 'workspaceId');
    const itemId = requireParam(req.params.itemId, 'itemId');
    await knowledgeService.deleteKnowledgeItem(itemId, workspaceId);

    successResponse(res, null, 'Knowledge item deleted successfully');
  } catch (error) {
    next(error);
  }
}