import { Client } from '@upstash/qstash';
export const qstash = new Client({
    token: process.env.QSTASH_TOKEN || '',
});
export var JobType;
(function (JobType) {
    JobType["SCRAPE_CONTENT"] = "scrape-content";
    JobType["GENERATE_SUMMARY"] = "generate-summary";
    JobType["GENERATE_EMBEDDING"] = "generate-embedding";
    JobType["EXTRACT_TAGS"] = "extract-tags";
    JobType["PROCESS_CHAT"] = "process-chat";
})(JobType || (JobType = {}));
export const QUEUE_CONFIG = {
    SCRAPE: {
        retries: 3,
        delay: 0,
    },
    SUMMARIZE: {
        retries: 2,
        delay: 0,
    },
    EMBED: {
        retries: 2,
        delay: 0,
    },
    TAG: {
        retries: 2,
        delay: 0,
    },
    CHAT: {
        retries: 1,
        delay: 0,
    },
};
console.log('QStash client initialized');
//# sourceMappingURL=qstash.js.map