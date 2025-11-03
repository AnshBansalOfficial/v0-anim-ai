-- ============================================
-- MANUAL SETUP INSTRUCTIONS FOR SUPABASE
-- ============================================
-- Copy and paste this entire script into the Supabase SQL Editor
-- This will create the prompt_cache table for storing video URLs

-- Step 1: Create the prompt_cache table
CREATE TABLE IF NOT EXISTS public.prompt_cache (
  prompt TEXT PRIMARY KEY,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_prompt_cache_created_at 
  ON public.prompt_cache(created_at);

-- Step 3: Add table description
COMMENT ON TABLE public.prompt_cache IS 
  'Cache table storing video URLs for prompts to avoid regenerating identical animations';

-- Step 4: Enable Row Level Security
ALTER TABLE public.prompt_cache ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policy to allow public read access
CREATE POLICY "Anyone can read prompt cache"
  ON public.prompt_cache
  FOR SELECT
  USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries after creating the table to verify setup:

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'prompt_cache';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'prompt_cache';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'prompt_cache';

-- ============================================
-- OPTIONAL: Sample data for testing
-- ============================================
-- Uncomment to insert test data:
INSERT INTO public.prompt_cache (prompt, video_url) 
VALUES ('test prompt', 'https://example.com/video.mp4')
ON CONFLICT (prompt) DO NOTHING;
