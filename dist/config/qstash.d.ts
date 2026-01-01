import { Client } from '@upstash/qstash';
export declare const qstash: Client;
export declare enum JobType {
    SCRAPE_CONTENT = "scrape-content",
    GENERATE_SUMMARY = "generate-summary",
    GENERATE_EMBEDDING = "generate-embedding",
    EXTRACT_TAGS = "extract-tags",
    PROCESS_CHAT = "process-chat"
}
export declare const QUEUE_CONFIG: {
    readonly SCRAPE: {
        readonly retries: 3;
        readonly delay: 0;
    };
    readonly SUMMARIZE: {
        readonly retries: 2;
        readonly delay: 0;
    };
    readonly EMBED: {
        readonly retries: 2;
        readonly delay: 0;
    };
    readonly TAG: {
        readonly retries: 2;
        readonly delay: 0;
    };
    readonly CHAT: {
        readonly retries: 1;
        readonly delay: 0;
    };
};
//# sourceMappingURL=qstash.d.ts.map