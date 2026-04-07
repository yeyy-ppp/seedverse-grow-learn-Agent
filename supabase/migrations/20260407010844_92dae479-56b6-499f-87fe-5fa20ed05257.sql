
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT DEFAULT '小小植物学家',
  avatar_emoji TEXT DEFAULT '🧒',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Plant scan history
CREATE TABLE public.user_plant_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id TEXT NOT NULL,
  plant_name TEXT NOT NULL,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_plant_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plant history" ON public.user_plant_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plant history" ON public.user_plant_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Game history
CREATE TABLE public.user_game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_game_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game history" ON public.user_game_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game history" ON public.user_game_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Collected seeds
CREATE TABLE public.user_seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id TEXT NOT NULL,
  current_stage INTEGER DEFAULT 0,
  unlocked BOOLEAN[] DEFAULT ARRAY[true],
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, plant_id)
);

ALTER TABLE public.user_seeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own seeds" ON public.user_seeds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own seeds" ON public.user_seeds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own seeds" ON public.user_seeds FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
