-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'live', 'full', 'ended', 'cancelled')),
  is_verified BOOLEAN DEFAULT FALSE,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going', 'waitlist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  followed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, followed_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for rsvps
CREATE POLICY "Users can view their own rsvps" ON public.rsvps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rsvps" ON public.rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rsvps" ON public.rsvps
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for followers
CREATE POLICY "Users can view all followers" ON public.followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON public.followers
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" ON public.followers
  FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER handle_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
