import  prisma  from '../../config/db.js';
import { logger } from '../../utils/logger.js';
import { NotFoundError } from '../../utils/error.js';
import { generateEmbeddingCached } from '../../services/ai/embedding.service.js';
import { vectorSearch, hybridSearch } from '../../services/ai/vector.service.js';
import { generateChatResponse } from '../../services/ai/chat.service.js';
import { MessageWithSources, ConversationWithMessages } from './chat.types.js';


export async function createConversation(userId: string, workspaceId: string, title?: string) {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title ?? null,
      },
    });

    logger.info(`Conversation created: ${conversation.id}`);
    return conversation;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
}


export async function getUserConversations(userId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    return conversations;
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    throw error;
  }
}


export async function getConversationWithMessages(
  conversationId: string,
  userId: string,
  limit: number = 50
): Promise<ConversationWithMessages> {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: limit,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const assistantMessages = conversation.messages.filter((m) => m.role === 'assistant');
    const allSourceIds = assistantMessages.flatMap((m) => m.sourceItemIds);

    const sources = await prisma.knowledgeItem.findMany({
      where: { id: { in: allSourceIds } },
      select: {
        id: true,
        summary: true,
        sourceUrl: true,
        metadata: true,
      },
    });

    const sourcesMap = sources.reduce((acc, s) => {
      acc[s.id] = {
        id: s.id,
        title: ((s.metadata as any)?.scrapedTitle as string) ?? s.summary ?? s.sourceUrl,
        sourceUrl: s.sourceUrl,
      };
      return acc;
    }, {} as Record<string, { id: string; title: string; sourceUrl: string }>);

    const messagesWithSources: MessageWithSources[] = conversation.messages.map((msg) => {
      if (msg.role !== 'assistant') return msg;
      const msgSources = msg.sourceItemIds.map((id) => sourcesMap[id]).filter(Boolean);
      return {
        ...msg,
        sources: msgSources as { id: string; title: string; sourceUrl: string }[],
      };
    });

    return {
      ...conversation,
      messages: messagesWithSources,
    };
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    throw error;
  }
}


export async function sendMessage(
  conversationId: string,
  userId: string,
  workspaceId: string,
  messageContent: string
) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10, // Last 10 messages
      select: {
        role: true,
        content: true,
      },
    });

    const recentHistory = history.slice(-4).filter(m => m.role === 'user').map(m => m.content).join(' ');
    const combinedQuery = recentHistory + ' ' + messageContent;

    const queryEmbedding = await generateEmbeddingCached(combinedQuery);

    const retrievedItems = await hybridSearch(queryEmbedding, combinedQuery, workspaceId, 5);

    const itemIds = retrievedItems.map((item: any) => item.id);
    const fullItems = await prisma.knowledgeItem.findMany({
      where: { id: { in: itemIds } },
      select: {
        id: true,
        scrapedContent: true,
      },
    });

    const context = retrievedItems.map((item: any) => {
      const fullItem = fullItems.find((f) => f.id === item.id);
      return {
        id: item.id,
        title: item.title ?? item.summary ?? item.sourceUrl,
        content: fullItem?.scrapedContent || item.summary || 'No content available',
        sourceUrl: item.sourceUrl,
      };
    });

    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: messageContent,
        sourceItemIds: [],
      },
    });

    const { response, sourceIds } = await generateChatResponse(
      messageContent,
      context,
      history.slice(0, -1) 
    );

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: response,
        sourceItemIds: sourceIds,
      },
    });

    if (!conversation.title) {
      const title = messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : '');
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { title },
      });
    }


    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    logger.info(`Message sent and response generated for conversation: ${conversationId}`);

    const fetchedSources = await prisma.knowledgeItem.findMany({
      where: { id: { in: sourceIds } },
      select: {
        id: true,
        summary: true,
        sourceUrl: true,
        metadata: true,
      },
    });

    const sources = fetchedSources.map((s) => ({
      id: s.id,
      title: ((s.metadata as any)?.scrapedTitle as string) ?? s.summary ?? s.sourceUrl,
      sourceUrl: s.sourceUrl,
    }));

    return {
      userMessage,
      assistantMessage: {
        ...assistantMessage,
        sources,
      },
    };
  } catch (error) {
    logger.error('Error sending message:', error);
    throw error;
  }
}


export async function deleteConversation(conversationId: string, userId: string) {
  try {
    await prisma.conversation.delete({
      where: {
        id: conversationId,
        userId,
      },
    });

    logger.info(`Conversation deleted: ${conversationId}`);
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    throw error;
  }
}