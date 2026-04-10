-- Add points and unlocked_pots to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unlocked_pots integer NOT NULL DEFAULT 6;

-- Create collected_cards table for flowering plant cards
CREATE TABLE public.collected_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  plant_id text NOT NULL,
  plant_name text NOT NULL,
  plant_emoji text NOT NULL DEFAULT '🌸',
  collected_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.collected_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cards"
ON public.collected_cards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
ON public.collected_cards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
ON public.collected_cards FOR DELETE
USING (auth.uid() = user_id);