-- Fix permissive RLS policy on activity_logs
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can create activity logs" ON public.activity_logs;

-- Create a proper policy that requires authentication
CREATE POLICY "Authenticated users can create activity logs"
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);