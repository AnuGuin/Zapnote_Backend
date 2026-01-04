import { generateWithFlash } from './gemini.service.js';
import { GENERATION_CONFIG } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';
export async function generateChatResponse(userQuery, retrievedContext, conversationHistory = []) {
    try {
        const contextText = retrievedContext
            .map((item, idx) => `[${idx + 1}] Title: ${item.title}
Summary: ${item.summary || 'No summary available'}
URL: ${item.sourceUrl}
---`)
            .join('\n\n');
        const historyText = conversationHistory
            .slice(-5)
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');
        const prompt = `You are a helpful AI assistant with access to the user's saved knowledge items. Answer the user's question based ONLY on the provided context. If the answer cannot be found in the context, say so clearly.

CONTEXT (Retrieved Knowledge Items):
${contextText}

${historyText ? `CONVERSATION HISTORY:\n${historyText}\n` : ''}

USER QUESTION: ${userQuery}

INSTRUCTIONS:
- Answer based ONLY on the provided context
- If information is not in context, say "I don't have information about that in your saved items"
- Cite sources by referring to their titles
- Be concise and helpful
- If multiple sources support your answer, mention all of them

ANSWER:`;
        const response = await generateWithFlash(prompt, GENERATION_CONFIG.CHAT);
        const sourceIds = retrievedContext.map((item) => item.id);
        logger.info('Chat response generated successfully');
        return {
            response: response.trim(),
            sourceIds,
        };
    }
    catch (error) {
        logger.error('Chat generation error:', error);
        throw new Error('Failed to generate chat response');
    }
}
//# sourceMappingURL=chat.service.js.map