-- Create leads table for tracking inbound prospects
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  industry TEXT,
  website TEXT,
  lead_source TEXT, -- website, referral, cold_call, trade_show, social_media, advertisement, partner
  status TEXT DEFAULT 'new', -- new, contacted, qualified, unqualified, converted
  rating TEXT DEFAULT 'warm', -- hot, warm, cold
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  converted_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  converted_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  converted_opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads RLS policies
CREATE POLICY "Users can view all leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create leads" ON public.leads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON public.leads
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can delete their own leads" ON public.leads
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_rating ON public.leads(rating);