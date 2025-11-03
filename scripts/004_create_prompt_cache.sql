-- Create prompt_cache table to store video URLs for repeated prompts
-- This table uses the prompt text as the primary key to ensure one video per unique prompt

CREATE TABLE IF NOT EXISTS public.prompt_cache (
  prompt TEXT PRIMARY KEY,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for potential cleanup queries
CREATE INDEX IF NOT EXISTS idx_prompt_cache_created_at ON public.prompt_cache(created_at);

-- Add a comment to the table
COMMENT ON TABLE public.prompt_cache IS 'Cache table storing video URLs for prompts to avoid regenerating identical animations';

-- Enable Row Level Security
ALTER TABLE public.prompt_cache ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read from cache (public access)
CREATE POLICY "Anyone can read prompt cache"
  ON public.prompt_cache
  FOR SELECT
  USING (true);

-- Note: Write access should only be done via service role key in the API
-- No INSERT/UPDATE/DELETE policies for regular users
