-- Function to increment participant count
CREATE OR REPLACE FUNCTION increment_participants(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.events 
  SET current_participants = current_participants + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement participant count
CREATE OR REPLACE FUNCTION decrement_participants(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.events 
  SET current_participants = GREATEST(current_participants - 1, 0)
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
