import { geminiFlash, geminiPro, genAI, GENERATION_CONFIG, GEMINI_MODELS } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function getErrorMessage(error) {
    return String(error?.message || error || 'Unknown error');
}
function isQuotaExceeded(error) {
    const msg = getErrorMessage(error).toLowerCase();
    return (msg.includes('quota exceeded') ||
        msg.includes('free_tier_requests') ||
        msg.includes('generativelanguage.googleapis.com/generate_content_free_tier_requests'));
}
function isAuthError(error) {
    const msg = getErrorMessage(error).toLowerCase();
    const status = error?.status;
    return status === 401 || status === 403 || msg.includes('api key') || msg.includes('permission denied');
}
function isRateLimit(error) {
    const msg = getErrorMessage(error);
    const status = error?.status;
    return status === 429 || msg.includes('429');
}
async function retryWithBackoff(fn, retries = 3, delay = 3000, maxDelay = 4000) {
    try {
        return await fn();
    }
    catch (error) {
        if (isAuthError(error)) {
            throw new Error(`AI authentication failed (check GOOGLE_API_KEY). Original error: ${getErrorMessage(error)}`);
        }
        if (isQuotaExceeded(error)) {
            throw new Error(`AI quota exceeded for the current plan/model. Upgrade billing or wait for quota reset. Original error: ${getErrorMessage(error)}`);
        }
        if (retries === 0 || !isRateLimit(error)) {
            throw error;
        }
        let waitTime = delay;
        const match = getErrorMessage(error).match(/retry in ([\d.]+)s/i);
        if (match && match[1]) {
            waitTime = Math.ceil(parseFloat(match[1]) * 1000);
        }
        waitTime = Math.min(waitTime, maxDelay);
        logger.warn(`Gemini 429 Rate Limit hit. Retrying in ${waitTime}ms... (Retries left: ${retries})`);
        await sleep(waitTime);
        return retryWithBackoff(fn, retries - 1, Math.min(delay * 2, maxDelay), maxDelay);
    }
}
export async function generateWithFlash(prompt, config) {
    try {
        return await retryWithBackoff(async () => {
            const result = await geminiFlash.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: config || GENERATION_CONFIG.CLASSIFICATION,
            });
            return result.response.text();
        });
    }
    catch (error) {
        logger.error('Gemini Flash error:', getErrorMessage(error));
        throw new Error(`AI generation failed: ${getErrorMessage(error)}`);
    }
}
export async function generateWithPro(prompt, config) {
    try {
        return await retryWithBackoff(async () => {
            const result = await geminiPro.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: config || GENERATION_CONFIG.CHAT,
            });
            return result.response.text();
        });
    }
    catch (error) {
        logger.error('Gemini Pro error:', getErrorMessage(error));
        throw new Error(`AI generation failed: ${getErrorMessage(error)}`);
    }
}
export async function generateEmbedding(text) {
    try {
        return await retryWithBackoff(async () => {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.EMBEDDING });
            const result = await model.embedContent({
                content: { role: 'user', parts: [{ text }] },
                outputDimensionality: 768
            });
            return result.embedding.values;
        });
    }
    catch (error) {
        logger.error('Embedding generation error:', error);
        throw new Error('Embedding generation failed');
    }
}
//# sourceMappingURL=gemini.service.js.map