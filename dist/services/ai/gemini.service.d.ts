import type { GenerationConfig } from '../../config/gemini.js';
export declare function generateWithFlash(prompt: string, config?: GenerationConfig): Promise<string>;
export declare function generateWithPro(prompt: string, config?: GenerationConfig): Promise<string>;
export declare function generateEmbedding(text: string): Promise<number[]>;
//# sourceMappingURL=gemini.service.d.ts.map