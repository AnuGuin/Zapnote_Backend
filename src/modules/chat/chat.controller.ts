import { Request, Response, NextFunction } from 'express';
import * as chatService from './chat.service.js';
import { successResponse } from '../../utils/response.js';
import { ValidationError } from '../../utils/error.js';


export async function createConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId } = req.params;
    const { title } = req.body;

    if (!workspaceId) throw new ValidationError('workspaceId is required');

    const conversation = await chatService.createConversation(
      req.userId,
      workspaceId,
      title
    );

    successResponse(res, conversation, 'Conversation created successfully', 201);
  } catch (error) {
    next(error);
  }
}


export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const conversations = await chatService.getUserConversations(req.userId);
    successResponse(res, conversations, 'Conversations fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { conversationId } = req.params;
    const { limit } = req.query;

    if (!conversationId) throw new ValidationError('conversationId is required');

    const conversation = await chatService.getConversationWithMessages(
      conversationId,
      req.userId,
      Number(limit) || 50
    );

    successResponse(res, conversation, 'Conversation fetched successfully');
  } catch (error) {
    next(error);
  }
}


export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspaceId, conversationId } = req.params;
    const { message } = req.body;

    if (!workspaceId) throw new ValidationError('workspaceId is required');
    if (!conversationId) throw new ValidationError('conversationId is required');

    const result = await chatService.sendMessage(
      conversationId,
      req.userId,
      workspaceId,
      message
    );

    successResponse(res, result, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
}


export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { conversationId } = req.params;

    if (!conversationId) throw new ValidationError('conversationId is required');

    await chatService.deleteConversation(conversationId, req.userId);

    successResponse(res, null, 'Conversation deleted successfully');
  } catch (error) {
    next(error);
  }
}