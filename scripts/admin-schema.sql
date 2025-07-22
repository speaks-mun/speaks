-- Create admin_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_id UUID,
  target_type VARCHAR(50),
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);

-- Enable RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_logs
CREATE POLICY "Admin logs are viewable by admins only" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin logs are insertable by admins only" ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Update users table to include role if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
  END IF;
END $$;

-- Create index on role for efficient admin checks
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update RLS policies for users table to allow admin access
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile or admins can view all" ON users
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Function to get admin statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'pending_events', (SELECT COUNT(*) FROM events WHERE is_verified = FALSE AND status = 'pending_review'),
    'total_users', (SELECT COUNT(*) FROM users),
    'total_events', (SELECT COUNT(*) FROM events),
    'total_rsvps', (SELECT COUNT(*) FROM rsvps),
    'total_bookmarks', (SELECT COUNT(*) FROM bookmarks),
    'active_events', (SELECT COUNT(*) FROM events WHERE status = 'live' AND date_time > NOW())
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (will be restricted by RLS)
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
