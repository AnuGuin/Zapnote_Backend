import { ContentType } from '@prisma/client';

export interface ScrapedData {
  title: string;
  content: string;
  type: ContentType;
  metadata: Record<string, any>;
}

export interface ScraperResult {
  success: boolean;
  data?: ScrapedData;
  error?: string;
}