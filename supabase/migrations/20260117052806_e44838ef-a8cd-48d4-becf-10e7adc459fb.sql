-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  entity_id TEXT,
  description TEXT NOT NULL,
  metadata JSONB,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX idx_activity_logs_entity_type ON public.activity_logs (entity_type);
CREATE INDEX idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs (user_id);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated and anonymous users to read activity logs (for demo purposes)
CREATE POLICY "Anyone can view activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (true);

-- Allow all users to insert activity logs (for demo purposes since we don't have auth yet)
CREATE POLICY "Anyone can create activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (true);

-- Enable realtime for activity logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;