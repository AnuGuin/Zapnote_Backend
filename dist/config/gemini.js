import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = process.env.GOOGLE_API_KEY || '';
if (!apiKey) {
    console.warn('[Gemini] GOOGLE_API_KEY is not set. AI features will fail.');
}
const genAI = new GoogleGenerativeAI(apiKey);
export const GEMINI_MODELS = {
    FLASH: 'gemini-2.5-flash',
    PRO: 'gemini-2.5-pro',
    EMBEDDING: 'gemini-embedding-2',
};
export const geminiFlash = genAI.getGenerativeModel({
    model: GEMINI_MODELS.FLASH,
});
export const geminiPro = genAI.getGenerativeModel({
    model: GEMINI_MODELS.PRO,
});
export const GENERATION_CONFIG = {
    CLASSIFICATION: {
        temperature: 0.1,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 100,
    },
    SUMMARIZATION: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
    },
    TAGGING: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
    },
    CHAT: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    },
};
console.log('Gemini AI initialized');
export { genAI };
//# sourceMappingURL=gemini.js.map