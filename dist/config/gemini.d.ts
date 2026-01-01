import { GoogleGenerativeAI } from '@google/generative-ai';
declare const genAI: GoogleGenerativeAI;
export declare const GEMINI_MODELS: {
    readonly FLASH: "gemini-2.5-flash";
    readonly PRO: "gemini-2.5-pro";
    readonly EMBEDDING: "text-embedding-004";
};
export declare const geminiFlash: import("@google/generative-ai").GenerativeModel;
export declare const geminiPro: import("@google/generative-ai").GenerativeModel;
export type GenerationConfig = {
    readonly temperature: number;
    readonly topK: number;
    readonly topP: number;
    readonly maxOutputTokens: number;
};
export declare const GENERATION_CONFIG: {
    readonly CLASSIFICATION: {
        readonly temperature: 0.1;
        readonly topK: 1;
        readonly topP: 0.95;
        readonly maxOutputTokens: 100;
    };
    readonly SUMMARIZATION: {
        readonly temperature: 0.3;
        readonly topK: 40;
        readonly topP: 0.95;
        readonly maxOutputTokens: 500;
    };
    readonly TAGGING: {
        readonly temperature: 0.2;
        readonly topK: 40;
        readonly topP: 0.95;
        readonly maxOutputTokens: 200;
    };
    readonly CHAT: {
        readonly temperature: 0.7;
        readonly topK: 40;
        readonly topP: 0.95;
        readonly maxOutputTokens: 2048;
    };
};
export { genAI };
//# sourceMappingURL=gemini.d.ts.map