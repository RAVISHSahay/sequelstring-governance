-- Create accounts table
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  account_type TEXT DEFAULT 'prospect', -- prospect, customer, partner, competitor
  status TEXT DEFAULT 'active', -- active, inactive, churned
  annual_revenue NUMERIC,
  employee_count INTEGER,
  parent_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  job_title TEXT,
  department TEXT,
  role_type TEXT, -- decision_maker, influencer, champion, blocker, user
  influence_level INTEGER DEFAULT 1 CHECK (influence_level >= 1 AND influence_level <= 5),
  sentiment TEXT DEFAULT 'neutral', -- positive, neutral, negative
  linkedin_url TEXT,
  notes TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  primary_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  stage TEXT DEFAULT 'prospecting', -- prospecting, qualification, proposal, negotiation, closed_won, closed_lost
  probability INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  expected_close_date DATE,
  actual_close_date DATE,
  lead_source TEXT,
  competitor TEXT,
  next_step TEXT,
  loss_reason TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Accounts RLS policies
CREATE POLICY "Users can view all accounts" ON public.accounts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create accounts" ON public.accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" ON public.accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can delete their own accounts" ON public.accounts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Contacts RLS policies
CREATE POLICY "Users can view all contacts" ON public.contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create contacts" ON public.contacts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" ON public.contacts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Opportunities RLS policies
CREATE POLICY "Users can view all opportunities" ON public.opportunities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create opportunities" ON public.opportunities
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities" ON public.opportunities
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can delete their own opportunities" ON public.opportunities
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_owner_id ON public.accounts(owner_id);
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_account_id ON public.contacts(account_id);
CREATE INDEX idx_opportunities_user_id ON public.opportunities(user_id);
CREATE INDEX idx_opportunities_account_id ON public.opportunities(account_id);
CREATE INDEX idx_opportunities_stage ON public.opportunities(stage);