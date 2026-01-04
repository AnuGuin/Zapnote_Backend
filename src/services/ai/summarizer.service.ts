import { generateWithFlash } from './gemini.service.js';
import { GENERATION_CONFIG } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';


export async function generateSummary(
  content: string,
  userIntent?: string
): Promise<string> {
  try {
    const intentContext = userIntent
      ? `\nUser's intent: "${userIntent}"\n`
      : '';

    const prompt = `Summarize the following content in a structured oneliner.
${intentContext}
Content:
${content.slice(0, 10000)}

Rules:
- Be concise: aim for one-liner summaries per point
- Focus on the key insights and main takeaways
- No introductory text, just the bullet points

Example format:
• This is a complete roadmap of how machine learning works focusing on basics and then stepping up`;

    const response = await generateWithFlash(prompt, GENERATION_CONFIG.SUMMARIZATION);

    logger.info('Summary generated successfully');
    return response.trim();
  } catch (error: any) {
    logger.error('Summarization error:', error?.message || error);
    throw new Error(`Summary generation failed: ${error?.message || 'Unknown error'}`);
  }
}