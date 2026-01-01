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

    const prompt = `Summarize the following content as 3-5 clear, concise bullet points.
${intentContext}
Content:
${content.slice(0, 10000)}

Rules:
- Each bullet point must start with "•" followed by a space
- Each bullet point should be on its own line
- Be concise but informative (1-2 sentences per point)
- Focus on the key insights and main takeaways
- No introductory text, just the bullet points

Example format:
• First key point here
• Second key point here
• Third key point here`;

    const response = await generateWithFlash(prompt, GENERATION_CONFIG.SUMMARIZATION);

    logger.info('Summary generated successfully');
    return response.trim();
  } catch (error: any) {
    logger.error('Summarization error:', error?.message || error);
    throw new Error(`Summary generation failed: ${error?.message || 'Unknown error'}`);
  }
}