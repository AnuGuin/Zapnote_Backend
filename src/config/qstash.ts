import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN || '',
});


export enum JobType {
  SCRAPE_CONTENT = 'scrape-content',
  GENERATE_SUMMARY = 'generate-summary',
  GENERATE_EMBEDDING = 'generate-embedding',
  EXTRACT_TAGS = 'extract-tags',
  PROCESS_CHAT = 'process-chat',
}

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
} as const;

console.log('QStash client initialized');