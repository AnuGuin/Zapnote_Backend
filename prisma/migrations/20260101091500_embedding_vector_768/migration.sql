-- This migration aligns the Embedding.vector dimension with Gemini text-embedding-004 (768 dims).
-- Embeddings can always be regenerated, so we delete existing rows to avoid cast failures.

-- Ensure pgvector exists
CREATE EXTENSION IF NOT EXISTS "vector";

-- Drop index before altering dimension
DROP INDEX IF EXISTS "Embedding_vector_idx";

-- Clear existing embeddings (safe to regenerate)
DELETE FROM "Embedding";

-- Change dimension from vector(1536) -> vector(768)
ALTER TABLE "Embedding"
  ALTER COLUMN "vector" TYPE vector(768)
  USING "vector"::vector(768);

-- Recreate vector index
CREATE INDEX "Embedding_vector_idx" ON "Embedding" USING hnsw ("vector" vector_cosine_ops);
