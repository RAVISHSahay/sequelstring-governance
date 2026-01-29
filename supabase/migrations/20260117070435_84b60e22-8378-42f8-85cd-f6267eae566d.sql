-- Create communications table for logging interactions
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- call, email, meeting, note, task, linkedin, sms
  direction TEXT, -- inbound, outbound (for calls/emails)
  subject TEXT,
  description TEXT,
  outcome TEXT, -- connected, voicemail, no_answer, busy, scheduled, completed, cancelled
  duration_minutes INTEGER,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  source TEXT, -- manual, gmail, outlook, calendar, auto_logged
  external_id TEXT, -- for synced emails/calendar events
  attachments JSONB DEFAULT '[]'::jsonb,
  follow_up_date DATE,
  follow_up_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Communications RLS policies
CREATE POLICY "Users can view all communications" ON public.communications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create communications" ON public.communications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own communications" ON public.communications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own communications" ON public.communications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON public.communications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_communications_user_id ON public.communications(user_id);
CREATE INDEX idx_communications_contact_id ON public.communications(contact_id);
CREATE INDEX idx_communications_lead_id ON public.communications(lead_id);
CREATE INDEX idx_communications_account_id ON public.communications(account_id);
CREATE INDEX idx_communications_opportunity_id ON public.communications(opportunity_id);
CREATE INDEX idx_communications_type ON public.communications(type);
CREATE INDEX idx_communications_scheduled_at ON public.communications(scheduled_at);
CREATE INDEX idx_communications_follow_up_date ON public.communications(follow_up_date);